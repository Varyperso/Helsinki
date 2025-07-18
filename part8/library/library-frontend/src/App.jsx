import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { ALL_BOOKS, BOOK_ADDED, ME } from "./queries";
import Favorite from "./components/Favorite";

export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, (data) => {
    if (!data || !data.allBooks) return { allBooks: [addedBook] }
    return { allBooks: uniqByName(data.allBooks.concat(addedBook)) }
  })
}

const App = () => {
  const [page, setPage] = useState('books')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  const client = useApolloClient()

  const me = useQuery(ME, { skip: !token }).data?.me

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      const cache = client.cache
      updateCache(cache, { query: ALL_BOOKS }, addedBook) // Update base query (no filter)]
      // filteredBooks by genre need a separate query entry in cache, null = 'all' so when a new book is added, the 'all' query get updated too
      updateCache(cache, { query: ALL_BOOKS, variables: { genre: null } }, addedBook)
      // updates all genres this book belongs to(if we're on "sci-fi" window it will update too)
      addedBook.genres.forEach((genre) => { updateCache(cache, { query: ALL_BOOKS, variables: { genre } }, addedBook) })
      // updated all authors to reflect the new book addition
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const existingAuthor = allAuthors.find(a => a.name === addedBook.author.name)
        if (existingAuthor) {
          return { allAuthors: allAuthors.map(a => a.name === addedBook.author.name ? { ...a, bookCount: a.bookCount + 1 } : a ) }
        }
        return { allAuthors: allAuthors.concat({ ...addedBook.author, bookCount: 1 }) }
      })
    }
  })
  
  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) setToken(token)
  }, [])

  useEffect(() => {
    setUser(me)
  }, [me])

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && 
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('favorite')}>favorite</button>
            <button onClick={logout}>logout</button> 
          </>
        }
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>

      {page === 'authors' && <Authors />}
      {page === 'books' && <Books />}  
      {page === 'add' && <NewBook />}
      {page === 'login' && <LoginForm setUser={setUser} setToken={setToken} setPage={setPage} setError={setErrorMessage} />}
      {page === 'favorite' && <Favorite user={user} />}

      {errorMessage && <div style={{ color: 'red' }}>{ errorMessage }</div>}
    </div>
  );
};

export default App;


// mutation {
//   createUser (
//     username: "mluukkai"
//   ) {
//     username
//     id
//   }
// }

// mutation {
//   login (
//     username: "mluukkai"
//     password: "secret"
//   ) {
//     value
//   }
// }