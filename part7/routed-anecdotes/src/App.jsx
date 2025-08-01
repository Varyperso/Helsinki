import { Routes, Route, Link, useMatch, useNavigate }  from 'react-router-dom'
import { useState } from 'react'
import { useFields } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to={'/'} style={padding}>anecdotes</Link>
      <Link to={'/create'} style={padding}>create new</Link>
      <Link to={'/about'} style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <Anecdote key={anecdote.id} anecdote={anecdote} link={true}/>)}
    </ul>
  </div>
)

const Anecdote = ({ anecdote, link, vote }) => {
  return link
    ? <li>
        <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
      </li>
    : 
      <div>
        <h2>{anecdote.content}</h2>
        <h3>{anecdote.author}</h3>
        <p>{anecdote.votes} votes</p>
        <p><a href={anecdote.info}>more info</a></p>
        <button onClick={() => vote(anecdote.id)}>vote</button>
      </div>
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>
    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = ({ addNew }) => {
  // although i can't spread it on the inputs like {...fieldName} and it kind of defeats the purpose of the course excercise, i went with this one..
  const { values, onChange, resetFields } = useFields({ content: '', author: '', info: '' }) 

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: values.content,
      author: values.author,
      info: values.info,
      votes: 0
    })
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={values.content} onChange={onChange('content')} />
        </div>
        <div>
          author
          <input name='author' value={values.author} onChange={onChange('author')} />
        </div>
        <div>
          url for more info
          <input name='info' value={values.info} onChange={onChange('info')} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={resetFields}>reset</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const match = useMatch('/anecdotes/:id')
  const anecdote = match ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id)) : null
  const navigate = useNavigate()

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`"${anecdote.content}" added`)
    setTimeout(() => {setNotification('')}, 5000)
    navigate('/')
  }
  const anecdoteById = id => anecdotes.find(a => a.id === id)
  const vote = (id) => {
    const anecdote = anecdoteById(id)
    const voted = { ...anecdote, votes: anecdote.votes + 1}
    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
    setNotification(`voted on "${anecdote.content}"`)
    setTimeout(() => {setNotification('')}, 5000)
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <p>{notification}</p>
      <Routes>
        <Route path='/' element={ <AnecdoteList anecdotes={anecdotes} /> } />
        <Route path='/create' element={ <CreateNew addNew={addNew} /> } />
        <Route path='/about' element={ <About /> } />
        <Route path='/anecdotes/:id' element={ <Anecdote anecdote={anecdote} vote={vote}/> } />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
