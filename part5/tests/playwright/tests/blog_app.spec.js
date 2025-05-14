const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, logout, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', { data: { name: 'artikika', username: 'abc', password: 'hhytr6' }})
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByText('Blogs')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('textbox').first().fill('abc')
    await page.getByRole('textbox').last().fill('hhytr6')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('hi artikika')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'abc', 'WRONG_PASSWORD')
    const notificationDiv = await page.locator('.notification') // find by css class "notification"
    await expect(notificationDiv).toContainText('invalid username or password')
    await expect(notificationDiv).toHaveCSS('border-style', 'solid')
    await expect(notificationDiv).toHaveCSS('color', 'rgb(176, 0, 32)')
  })

  test('user can login', async ({ page }) => {
    await loginWith(page, 'abc', 'hhytr6')
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'abc', 'hhytr6')
    })

    test('a new note can be created', async ({ page }) => {
      createBlog(page, { title:'playwright title', author: 'playwright author', url: 'playwright URL' })
      await expect(page.getByText('playwright title by playwright author')).toBeVisible()

      await page.getByRole('button', { name: 'Show More' }).last().click() // click on the last entry's "Show More" button to display the newly created URL
      await expect(page.getByText('playwright URL')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, { title: 'playwright title', author: 'playwright author', url: 'playwright URL' })
      })
  
      test('likes can be added', async ({ page }) => {
        await page.getByRole('button', { name: 'Show More' }).last().click()
        await expect(page.getByText('Likes: 0')).toBeVisible()
        await page.getByRole('button', { name: '+' }).click()
        await expect(page.getByText('Likes: 1')).toBeVisible()
      })

      test('a note can be deleted', async({ page }) => {
        page.once('dialog', async (dialog) => { // once there's a dialog on screen(when it appears), do this: 
          expect(dialog.type()).toBe('confirm') // check if its a confirm dialog
          await dialog.accept() // Accept the confirmation (click OK)
        })
        await page.getByRole('button', { name: 'Show More' }).last().click()
        await page.getByRole('button', { name: 'Delete' }).click()
        await expect(page.getByRole('button', { name: 'Delete'})).not.toBeVisible()
      })

      test('a note of another user cannot be deleted', async({ page, request }) => {
        await logout(page)
        await request.post('/api/users', { data: { name: 'artikika', username: 'abc2', password: 'hhytr6' }})
        await loginWith(page, 'abc2', 'hhytr6')
        await page.getByRole('button', { name: 'Show More' }).last().click()
        await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, { title: 'playwright title', author: 'playwright author', url: 'playwright URL' })
        await createBlog(page, { title: 'playwright title2', author: 'playwright author2', url: 'playwright URL2' })
        await createBlog(page, { title: 'playwright title3', author: 'playwright author3', url: 'playwright URL3' })
      })

      test('one of those can be liked', async ({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: 'playwright title2' }) // find all blogs by their .blog classname
        await blog.getByRole('button', { name: 'Show More' }).click() // click on the show more of the specific blog we found
        await expect(page.getByText(/playwright URL/)).toBeVisible() // url should appear after clikcing on show more
        await blog.getByRole('button', { name: '+' }).click() // add a like
        await expect(blog.getByText('Likes: 1')).toBeVisible() // likes should go from 0 to 1
      })

      test.only('all blogs are arranged by their "likes" property, descending', async ({ page }) => {
        const blogs = page.locator('.blog') // all blogs array
        const count = await blogs.count();
        for (let i = 0; i < count; i++) {
          const blog = blogs.nth(i);
          await blog.getByRole('button', { name: 'Show More' }).click()
          for (let j = 0; j <= i; j++) await blog.getByRole('button', { name: '+' }).click() // add a like
        }

        await page.waitForTimeout(500); // optional, can be replaced by a smarter wait

        const likeCounts = [];
        for (let i = 0; i < count; i++) {
          const blog = blogs.nth(i);
          const likeText = await blog.getByText(/Likes:/).textContent();
          const likes = parseInt(likeText?.replace('Likes: ', '') || '0', 10);
          likeCounts.push(likes);
        }

        for (let i = 0; i < likeCounts.length - 1; i++) {
          expect(likeCounts[i]).toBeGreaterThanOrEqual(likeCounts[i + 1]);
        }
      })
    })
  }) 
})