require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author.js')
const Book = require('./models/book.js')

const MONGODB_URI = process.env.MONGODB_URI

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
    bookCount: 2,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
    bookCount: 1,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
    bookCount: 2,
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    bookCount: 1,
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    bookCount: 1,
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('connected to MongoDB')

    await Author.deleteMany({})
    await Book.deleteMany({})

    // 1. Insert authors
    const insertedAuthors = await Author.insertMany(authors)

    // 2. Map author names to their ObjectIds
    const authorMap = {}
    insertedAuthors.forEach(author => {
      authorMap[author.name] = author._id
    })

    // 3. Replace author names with ObjectIds in book data
    const booksWithAuthorIds = books.map(book => ({
      ...book,
      author: authorMap[book.author] // ✅ now it's an ObjectId
    }))

    // 4. Insert books
    await Book.insertMany(booksWithAuthorIds)

    console.log('Database populated successfully!')
  } catch (error) {
    console.error('Error populating DB:', error.message)
  } finally {
    mongoose.connection.close()
  }
}

console.log('connecting to', MONGODB_URI)
run()