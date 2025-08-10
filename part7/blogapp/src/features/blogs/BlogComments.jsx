export default function BlogComments({ comments }) {
  return (
    <ul>
      {comments.map(comment => <li key={comment.id}> {comment.content} </li>)}
    </ul>
  )
}
