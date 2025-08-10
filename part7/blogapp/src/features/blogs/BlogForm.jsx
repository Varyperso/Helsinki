import styled from 'styled-components'
import { useState } from 'react'
import { Input } from '../../styled/Input'
import Button from '../../components/Buttons'

const Form = styled.form`
  display: inline-block;
`

const BlogForm = ({ onAddBlog }) => {
  const [blog, setBlog] = useState({ title: '', author: '', url: 'http://' })

  const handleInputChange = ({ target }) => setBlog(prev => ({ ...prev, [target.name]: target.value }))

  const handleAddBlog = async (e) => {
    e.preventDefault()
    onAddBlog(blog)
    setBlog({ title: '', author: '', url: 'http://' })
  }

  return (
    <Form onSubmit={handleAddBlog}>
      <label htmlFor="title">
        Title {' '}
        <Input type="text" id="title" name="title" value={blog.title} onChange={handleInputChange} data-testid="title" /> {' '}
      </label>
      <label htmlFor="author">
        Author {' '}
        <Input type="text" id="author" name="author" value={blog.author} onChange={handleInputChange} /> {' '}
      </label>
      <label htmlFor="url">
        URL {' '}
        <Input type="text" id="url" name="url" value={blog.url} onChange={handleInputChange} /> {' '}
      </label> {' '}
      <Button type="submit">Save</Button>
    </Form>
  )
}

export default BlogForm