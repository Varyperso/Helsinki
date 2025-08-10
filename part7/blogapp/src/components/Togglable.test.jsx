import { screen } from '@testing-library/react' 
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'
import { renderWithTheme } from '../testUtils'

describe('<Togglable />', () => {
  let container // render returns a container object that contains methods to access dom elements

  beforeEach(() => {
    container = renderWithTheme(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('togglable content') // the parent div is display: none by default but is still rendered to the DOM - just not visible
  })

  test('at start the children are not displayed', () => {
    const content = screen.getByTestId('togglable-content')
    expect(content).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const content = screen.getByTestId('togglable-content')
    expect(content).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('Cancel')
    await user.click(closeButton)

    const content = screen.getByTestId('togglable-content')
    expect(content).toHaveStyle('display: none')
  })
})