const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
  const { title, author, url } = content;
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Author').fill(author)
  await page.getByLabel('URL').fill(url)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(content.title).waitFor()
}

const logout = async (page)  => {
  await page.getByRole('button', { name: 'logout' }).click()
}

export { loginWith, createBlog, logout }