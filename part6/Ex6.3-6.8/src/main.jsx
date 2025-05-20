//import './styles.css'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import Login from '../Login'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Login />
  </Provider>
)