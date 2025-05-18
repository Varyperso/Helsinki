import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducers/counterReducer'
import { Provider } from 'react-redux'
import App from "./App"

const counterStore = createStore(counterReducer)

ReactDOM.createRoot(document.getElementById('root')).render(<Provider store={counterStore}> <App/> </Provider>)