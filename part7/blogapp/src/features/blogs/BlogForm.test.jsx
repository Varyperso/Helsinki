import { screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../testUtils';

test('<BlogForm /> updates parent state and calls onAddBlog', async () => {
  const onAddBlog = vi.fn()
  const user = userEvent.setup()

  renderWithTheme(<BlogForm onAddBlog={onAddBlog} />)

  const inputTitle = screen.getByRole('textbox', { name: 'Title' }) // found the <input> because its associated label's text is "Title"
  const inputAuthor = screen.getByRole('textbox', { name: 'Author' })
  const inputURL = screen.getByRole('textbox', { name: 'URL' })
  const sendButton = screen.getByText('save')

  await user.type(inputTitle, 'a') 
  await user.type(inputAuthor, 'b')
  await user.type(inputURL, 'c')
  await user.click(sendButton)

  expect(onAddBlog.mock.calls).toHaveLength(1)
  expect(onAddBlog.mock.calls[0][0]).toEqual({ title: 'a', author: 'b', url: 'http://c' }) // calls[0] first call, calls[0][0] first argument of first call
})