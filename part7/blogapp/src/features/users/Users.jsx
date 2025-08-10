import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router";
import { fetchAllUsers } from "./usersSlice";
import { useEffect } from "react";

const linkStyle = { display: 'inline-block', width: '10ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'bottom' }

const Users = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users.data)

  useEffect(() => {
    if (user.status === "succeeded") dispatch(fetchAllUsers())
  }, [user.status])

  if (user.status === 'idle' || user.status === 'failed') return <div>Please Login..</div>
  if (users.length === 0) return <div>No Users Yet..</div>
  
  return (
    <div style={{ whiteSpace: 'pre', fontFamily: 'monospace' }}>
      username: {' '.repeat(4) + 'Blogs Created:'}
      {users.map(user => <div key={user.id}><Link style={linkStyle} to={`/users/${user.id}`}>{user.username}</Link>{' '.repeat(5) + user.blogs.length}</div>)}
    </div>
  )
}

export default Users