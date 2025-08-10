const Notification = ({ children }) => {
  const isError = children && children.startsWith('Error')

  const style = {
    color: isError ? '#b00020' : !children ? 'transparent' : '#0b6623',
    backgroundColor: isError ? '#ffd6d6' : !children ? 'transparent' : '#d6ffd6',
    border: `1px solid ${isError ? '#b00020' : !children ? 'transparent' : '#0b6623'}`,
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '15px',
    fontWeight: '500',
    minHeight: '26px'
  }

  return <p style={style} className="notification">{children}</p>
}

export default Notification