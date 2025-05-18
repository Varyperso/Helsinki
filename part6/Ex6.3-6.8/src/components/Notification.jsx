import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector(state => state.notification)
  const style = { border: 'solid', padding: 10, marginInline: '1rem', borderWidth: 1, minHeight: '3.5rem', flex: '1 0 300px', fontSize: '1rem' }
  return <div style={style}> {notification} </div>
}

export default Notification