import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const [currentGenre, setCurrentGenre] = useState('all')

  const allBooks = useQuery(ALL_BOOKS).data?.allBooks

  console.log("allBooks from Books.jsx", allBooks);

  const filteredBooks = useQuery(ALL_BOOKS, {
    variables: { genre: currentGenre === 'all' ? null : currentGenre }
  }).data?.allBooks

   console.log("filteredBooks from Books.jsx", filteredBooks);

  if (!allBooks || !filteredBooks) return <div>Loading...</div>
  
  const uniqueGenres = ['all', ...new Set(allBooks.reduce((allGenres, book) => {
    allGenres.push(...book.genres)
    return allGenres
  }, []))]

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres.map(genre => 
        <button key={genre} onClick={() => setCurrentGenre(genre)} style={{ fontWeight: currentGenre === genre ? 'bold' : 'normal' }}>{ genre }</button>
      )}
    </div>
  )
}

export default Books
