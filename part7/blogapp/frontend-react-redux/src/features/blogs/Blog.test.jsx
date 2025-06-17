import * as blogSlice from './blogsSlice'
import { vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { renderWithRedux } from '../../testUtils'
import { updateBlog } from './blogsSlice'

vi.spyOn(blogSlice, 'updateBlog').mockImplementation(() => () => Promise.resolve())

const mockUser = {
  token: 'fake-token-123',
  username: 'testuser',
  name: 'Test User',
  id: 'u1',
  status: 'succeeded',
  error: null,
  blogs: ['fakeblogId']
};

const mockBlog = {
  title: 'make not important',
  author: "me",
  url: "yes",
  likes: 0,
  comments: [{ content: 'ok '}],
  user: {
    token: 'fake-token-123',
    username: 'testuser',
    name: 'Test User',
    id: 'u1',
    status: 'succeeded',
    error: null,
  }
}

const preloadedState = {
  user: mockUser,
  blogs: {
    items: [mockBlog],
    status: 'idle',
    error: null
  },
};

test('clicking on "+" increases the likes counter', async () => {
  renderWithRedux(<Blog />, { preloadedState })

  const user = userEvent.setup()

  expect(screen.getByText(/Likes: 0/i)).toBeInTheDocument();
  const likesButton = screen.getByText('+')
  await user.click(likesButton)
  expect(updateBlog).toHaveBeenCalled()
})

test('renders title, author and url', async () => {
  renderWithRedux(<Blog />, { preloadedState })

  const titleAndAuthorElement = await screen.findByText('make not important By me')
  expect(titleAndAuthorElement).toBeInTheDocument()

  const URLElement = await screen.findByText('yes')
  expect(URLElement).toBeVisible()
})

// screen.debug() // print html tree to console
// screen.debug(element) // print specific element to console