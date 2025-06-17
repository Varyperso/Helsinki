const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, logout, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', { data: { name: 'artikika', username: 'abc', password: 'hhytr6' }})
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('textbox').first().fill('abc')
    await page.getByRole('textbox').last().fill('hhytr6')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Hello abc !')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'abc', 'WRONG_PASSWORD')
    const notificationDiv = page.getByTestId('notification'); // find by --data-testid "notification"
    await expect(notificationDiv).toContainText('invalid username or password')
    await expect(notificationDiv).toHaveCSS('border-style', 'solid')
    await expect(notificationDiv).toHaveCSS('color', 'rgb(176, 0, 32)')
  })

  test('user can login', async ({ page }) => {
    await loginWith(page, 'abc', 'hhytr6')
    const notificationDiv = page.getByTestId('notification');
    await expect(notificationDiv).toContainText('abc logged in!')
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'abc', 'hhytr6')
    })

    test('a new blog can be created, entered and viewed', async ({ page }) => {
      createBlog(page, { title: 'playwright title', author: 'playwright author', url: 'playwright URL' })
      await expect(page.getByText('playwright title')).toBeVisible()
      await page.getByRole('link', { name: 'playwright title' }).click()
      await expect(page.getByText('playwright URL')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, { title: 'playwright title', author: 'playwright author', url: 'playwright URL' })
      })
  
      test('likes can be added', async ({ page }) => {
        await expect(page.getByText('playwright title')).toBeVisible()
        await page.getByRole('link', { name: 'playwright title' }).click()
        await expect(page.getByText('Likes: 0')).toBeVisible()
        await page.getByRole('button', { name: '+' }).click()
        await expect(page.getByText('Likes: 1')).toBeVisible()
      })

      test('a blog can be deleted', async({ page }) => {
        await expect(page.getByRole('link', { name: 'playwright title' })).toBeVisible()
        await page.getByRole('link', { name: 'playwright title' }).click()
        await page.getByRole('button', { name: 'Delete Blog' }).click()
        page.once('dialog', async (dialog) => { // once there's a dialog on screen(when it appears), do this: 
          expect(dialog.type()).toBe('confirm') // check if its a confirm dialog
          await dialog.accept() // Accept the confirmation (click OK)
        })
        await expect(page.getByRole('link', { name: 'playwright title' })).not.toBeVisible()
      })

      test('a blog of another user cannot be deleted', async({ page, request }) => {
        await logout(page)
        await request.post('/api/users', { data: { name: 'artikika', username: 'abc2', password: 'hhytr6' }})
        await loginWith(page, 'abc2', 'hhytr6')
        await page.getByRole('link', { name: 'playwright title' }).click()
        await expect(page.getByText('Likes: 0')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Delete Blog' })).not.toBeVisible()
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, { title: 'playwright title', author: 'playwright author', url: 'playwright URL' })
        await createBlog(page, { title: 'playwright title2', author: 'playwright author2', url: 'playwright URL2' })
        await createBlog(page, { title: 'playwright title3', author: 'playwright author3', url: 'playwright URL3' })
      })

      test.only('one of those can be liked', async ({ page }) => {
        const blog = page.getByRole('link', { name: 'playwright title2' }) // find all blogs by their .blog classname
        await blog.click()
        await expect(page.getByText(/playwright URL2/)).toBeVisible() // url should appear after clicking on show more
        await page.getByRole('button', { name: '+' }).click() // add a like
        await expect(page.getByText('Likes: 1')).toBeVisible() // likes should go from 0 to 1
      })
    })
  }) 
})