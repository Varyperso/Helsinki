const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const User = require('./models/user.js')
const Author = require('./models/author.js')
const Book = require('./models/book.js')
const { default: mongoose } = require('mongoose')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    me: (root, args, context) => context.currentUser,
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}
      if (args.genre && args.genre !== 'all') filter.genres = { $in: [args.genre] }
      
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return [] // no such author
        filter.author = author._id
      }

      return Book.find(filter).populate('author')
    },
    allAuthors: async () => await Author.find({})
  },

  // Author: { // no need for this, added "bookCount" to the Author mongo model to solve the n+1 problem this creates
  //   bookCount: async (root) => await Book.countDocuments({ author: root._id }) //root._id is the returned author from "allAuthors" above
  // },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User({ ...args })
      return user.save().catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') { // temporary password for demo
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }

      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    addBook: async (root, args, context) => {
      if (!context.currentUser) throw new GraphQLError('Not authenticated')
       
      validateAndTrimStringArgs(args)

      const existingBook = await Book.findOne({ title: args.title })
      if (existingBook) {
        throw new GraphQLError(`Book titled "${args.title}" already exists`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      const session = await mongoose.startSession(); // The session object ties all .save() operations together
      session.startTransaction();

      try {
        let author = await Author.findOne({ name: args.author }).session(session);
        if (!author) {
          author = new Author({ name: args.author, born: null, bookCount: 1 });
          await author.save({ session });
        }
        else author.bookCount = author.bookCount + 1
        await author.save({ session });

        const newBook = new Book({ ...args, author: author._id });
        await newBook.save({ session });

        await session.commitTransaction(); // here it actually saves both author and book if both of them didn't fail
        session.endSession();

        const bookAdded = await newBook.populate('author');
        pubsub.publish('BOOK_ADDED', { bookAdded });
        console.log("book added before return", bookAdded);
        
        return bookAdded;
      } catch (error) {
        await session.abortTransaction(); // If anything fails, abortTransaction() rolls back all changes
        session.endSession();

        throw new GraphQLError('Transaction failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) throw new GraphQLError('Not authenticated')

      if (args.setBornTo > new Date().getFullYear() - 5) {
        throw new GraphQLError(`Author ${args.name} is too young to know how to write or wasn't even born yet..`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      } 
       
      const authorToEdit = await Author.findOne({ name: args.name })
      if (!authorToEdit) {
        throw new GraphQLError(`Author ${args.name} doesn't exist`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
       })
      } 

      authorToEdit.born = args.setBornTo 
      try {
        await authorToEdit.save()
      }
      catch(error) {
        throw new GraphQLError(`Saving Author ${args.name} failed`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return authorToEdit
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    },
  },
}

function validateAndTrimStringArgs(args) {
  for (const [key, value] of Object.entries(args)) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      args[key] = trimmed;
      if (trimmed === '') { // if we passed an empty string(graphql allows empty strings to be passed on required fields)
        throw new GraphQLError(`Field "${key}" must not be empty`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: key
          }
        });
      }
    }
  }
}

module.exports = resolvers