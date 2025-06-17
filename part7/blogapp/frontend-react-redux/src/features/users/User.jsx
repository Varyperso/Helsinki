import { useSelector } from "react-redux"
import { Link, useParams } from "react-router"
import styled from "styled-components"

const BlogW = styled.div`
  margin-block: 1rem;
  border: 1px solid #666;
  border-radius: 1em;
  padding: 0.5em;
`

export default function User() {
  const users = useSelector(state => state.users.data)
  const userId = useParams().id

  if (!users.length) return <div>Loading..</div>
  if (!userId) return <div>Invalid User..</div>

  const user = users.find(u => u.id === userId)
  
  return (
    <>
      <p><u><b>{user.username}</b></u></p>
      <h3>Blogs:</h3>
      {user.blogs.map(b => (
        <BlogW key={b.id}>
          <Link to={`/blogs/${b.id}`}>{b.title} By {b.author}</Link>
        </BlogW>
      ))}
    </>
  )
}