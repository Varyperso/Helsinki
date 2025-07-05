import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useState } from 'react';

const Authors = () => {
  const [error, setError] = useState('')

  const authors = useQuery(ALL_AUTHORS).data?.allAuthors;
  
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
      setTimeout(() => setError(''), 4000)
    }
  })
  
  if (!authors) return <div> Loading.. </div>

  const handleYearChange = (e) => {
    e.preventDefault()
    const name = e.target.authorOption.value;
    const setBornTo = e.target.born.valueAsNumber
    const { data, error } = editAuthor({ variables: { name, setBornTo } }) // already handling the "error" in the "onError" above^^ ..
  }

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set Birth Year</h3>
      <form onSubmit={handleYearChange}>
        <label>
          Pick Author:
          <select name="authorOption">
            {authors.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>
        </label>
        <br />
        <label>
          Change Birth Year:
          <input type="number" name="born" />
        </label>
        <button type="submit">Submit</button>
      </form>

      {error && <div style={{ color: 'red' }}>{ error }</div>}
    </div>
  )
}

export default Authors
