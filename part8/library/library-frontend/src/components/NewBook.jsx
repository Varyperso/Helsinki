import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [error, setError] = useState('')

  const [ addBook ] = useMutation(ADD_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    },
    // update: (cache, response) => { // update cache logic BEFORE we had websocket subscriptions update the cache...
    //   const newBook = response.data.addBook

    //   cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    //     return { allBooks: allBooks.concat(newBook) }
    //   })

    //   cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
    //     const existingAuthor = allAuthors.find(a => a.name === newBook.author.name)
    //     if (existingAuthor) {
    //       const updatedAuthor = { ...existingAuthor, bookCount: existingAuthor.bookCount + 1 }
    //       return { allAuthors: allAuthors.map(a => a.name === updatedAuthor.name ? updatedAuthor : a) }
    //     } 

    //     return { allAuthors: allAuthors.concat({ ...newBook.author, bookCount: 1 }) } // new author
    //   })
    // }
  })

  const submit = async (event) => {
    event.preventDefault()

    addBook({ variables: { title, author, published, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.valueAsNumber)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
      {error && <div>{ error }</div>}
    </div>
  )
}

export default NewBook