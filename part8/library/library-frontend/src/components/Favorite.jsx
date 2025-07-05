import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Favorite = ({ user }) => {
  const allBooks = useQuery(ALL_BOOKS).data?.allBooks
  
  const filteredBooks = allBooks.filter(book => book.genres.includes(user.favoriteGenre))

  return (
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
  )
}

export default Favorite