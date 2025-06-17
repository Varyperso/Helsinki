const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
  const { title, author, url } = content;
  await page.getByRole('button', { name: 'New Blog' }).click()
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Author').fill(author)
  await page.getByLabel('URL').fill(url)
  await page.getByRole('button', { name: 'Save' }).click()
  await page.getByRole('link', { name: 'playwright title' }).waitFor()
}

const logout = async (page)  => {
  await page.getByRole('button', { name: 'Logout' }).click()
}

export { loginWith, createBlog, logout }