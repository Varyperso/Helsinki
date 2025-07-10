import { useSelector } from "react-redux"
import { Link, useParams } from "react-router"
import styled from "styled-components"

const BlogW = styled.div`
  margin-block: 1rem;
  border: ${({ theme }) => `0.125em solid ${theme.colors.bgLight}`};
  border-radius: 1em;
  padding: 0.5em;
`

export default function User() {
  const users = useSelector(state => state.users.data)
  const userId = useParams().id

  if (!users.length) return <div>Loading..</div>
  if (!userId) return <div>Invalid User..</div>

  const userPage = users.find(u => u.id === userId)
  
  return (
    <>
      <p><u><b> {userPage.username} </b></u></p>
      <h3>Blogs:</h3>
      {userPage.blogs.map(b => (
        <BlogW key={b.id}>
          <Link to={`/blogs/${b.id}`}>{b.title} By {b.author}</Link>
        </BlogW>
      ))}
    </>
  )
}