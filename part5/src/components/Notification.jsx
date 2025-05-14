const Notification = ({ children }) => {
  if (!children[1]) return null // children[1] because i like to keep children[0] as " " empty string :()
  
  const isError = children[1].startsWith('Error')

  const style = {
    color: isError ? '#b00020' : '#0b6623',
    backgroundColor: isError ? '#ffd6d6' : '#d6ffd6',
    border: `1px solid ${isError ? '#b00020' : '#0b6623'}`,
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '15px',
    fontWeight: '500'
  }

  return <p style={style} className="notification" > {children} </p>
}

export default Notification
