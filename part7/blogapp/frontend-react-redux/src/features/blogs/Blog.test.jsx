import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('onAddLike is called on increasing the likes counter + called multiple times', async () => {
  const blog = {
    title: 'make not important',
    author: "me",
    url: "yes",
    likes: 7
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} onAddLike={mockHandler} />)
  // screen.debug() // print html tree to console

  // screen.debug(element) // print specific element to console
  const user = userEvent.setup()
  const showMoreButton = screen.getByText('Show More')
  await user.click(showMoreButton) // render the likes button

  const likesButton = screen.getByText('+')
  await user.click(likesButton)
  expect(mockHandler.mock.calls).toHaveLength(1)

  await user.click(likesButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('renders title and author but not likes and url(they are hidden by default)', async () => {
  const blog = {
    title: 'test blog1',
    author: "me1",
    url: "http://yes1",
    likes: 776
  }

  render(<Blog blog={blog} />)
  const titleAndAuthorElement = await screen.findByText('test blog1 by me1')
  expect(titleAndAuthorElement).toBeInTheDocument()

  const user = userEvent.setup()
  const showMoreButton = screen.getByText('Show More')
  await user.click(showMoreButton) // show the likes and the url

  const likesElement = await screen.findByText('Likes: 776')
  expect(likesElement).toBeVisible()
  const URLElement = await screen.findByText('http://yes1')
  expect(URLElement).toBeVisible()

  await user.click(showMoreButton) // hide the likes and the url(removed from the dom via conditional rendering)

  expect(likesElement).not.toBeInTheDocument() // check that they left the dom
  expect(URLElement).not.toBeInTheDocument()
})