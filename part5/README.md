const textboxes = await page.getByRole('textbox').all() // finds multiple elements into an array
await textboxes[0].fill('mluukkai')
await textboxes[1].fill('salainen')

await page.getByRole('textbox').first().fill('mluukkai') // find first and last multiple elements
await page.getByRole('textbox').last().fill('salainen')

data-testid='username' // a better solution than both above is to use data-testid attribute and the getByTestId method
await page.getByTestId('username').fill('mluukkai')
await page.getByTestId('password').fill('salainen')

const notificationDiv = await page.locator('.notification') // find by css class "notification"
await expect(notificationDiv).toContainText('invalid username or password')

const secondNoteElement = await page.getByText('second note').locator('..') // the ".." targets the parent of the element with the text "second note"

await page.getByText(content).waitFor() // put at the end of commands that change react state, like adding a blog. "content" is a string here