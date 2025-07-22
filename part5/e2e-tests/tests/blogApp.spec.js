const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ request, page }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123',
    }
    await request.post('http://localhost:3003/api/users', { data: newUser })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('login-form')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByTestId('login-button')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('[data-testid="username"]', 'testuser')
      await page.fill('[data-testid="password"]', 'password123')
      await page.click('[data-testid="login-button"]')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('[data-testid="username"]', 'testuser')
      await page.fill('[data-testid="password"]', 'wrongpassword')
      await page.click('[data-testid="login-button"]')
      await page.waitForSelector('[data-testid="notification"]')
      await expect(page.getByTestId('notification')).toHaveText('Wrong credentials')
      await expect(page.getByTestId('notification')).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })
})

test.describe('When logged in', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'password123',
      },
    })

    await page.goto('http://localhost:5173')

    await page.fill('[data-testid="username"]', 'testuser')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-button"]')

    await expect(page.locator('text=Blogs')).toBeVisible()
  })

  test('a new blog can be created', async ({ page }) => {
    await page.click('text=Create new blog')

    await page.waitForSelector('[data-testid="title-input"]')

    await page.fill('[data-testid="title-input"]', 'My new blog')
    await page.fill('[data-testid="author-input"]', 'Tester')
    await page.fill('[data-testid="url-input"]', 'http://example.com')

    await page.click('[data-testid="create-button"]')

    await expect(
      page.locator('.blog-title-author', { hasText: 'My new blog' }).first()
    ).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await page.click('text=Create new blog')
    await page.fill('input#title', 'Blog to like')
    await page.fill('input#author', 'Tester')
    await page.fill('input#url', 'http://example.com')
    await page.click('text=create')

    const blog = page.locator('div.blog', { hasText: 'Blog to like' })

    await blog.getByRole('button', { name: 'view' }).click()

    const likesCount = blog.locator('[data-testid="likes-count"]')

    const likesText = await likesCount.textContent()
    const initialLikes = Number(likesText.match(/\d+/)[0]) || 0

    await blog.getByRole('button', { name: 'like' }).click()

    await expect(likesCount).toHaveText(`likes ${initialLikes + 1} like`)
  })

  test('the user who created a blog can delete it', async ({ page, request }) => {
    await page.click('text=Create new blog')
    await page.fill('input#title', 'Blog to delete')
    await page.fill('input#author', 'Author')
    await page.fill('input#url', 'http://example.com')
    await page.click('text=create')

    await expect(page.locator('.blog-title-author', { hasText: 'Blog to delete' })).toBeVisible()

    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    await page
      .locator('.blog-title-author', { hasText: 'Blog to delete' })
      .locator('button', { hasText: 'view' })
      .click()

    await page
      .locator('.blog', { hasText: 'Blog to delete' })
      .locator('button', { hasText: 'remove' })
      .click()

    await expect(
      page.locator('.blog-title-author', { hasText: 'Blog to delete' })
    ).not.toBeVisible()
  })

  test('only the user who added the blog sees the delete button', async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    const user1 = {
      username: 'user1',
      name: 'User One',
      password: 'password1',
    }
    const user2 = {
      username: 'user2',
      name: 'User Two',
      password: 'password2',
    }

    await request.post('http://localhost:3003/api/users', { data: user1 })
    await request.post('http://localhost:3003/api/users', { data: user2 })

    await page.goto('http://localhost:5173')
    await page.click('[data-testid="logout-button"]')

    await page.fill('[data-testid="username"]', user1.username)
    await page.fill('[data-testid="password"]', user1.password)
    await page.click('[data-testid="login-button"]')

    await page.click('text=Create new blog')
    await page.fill('[data-testid="title-input"]', 'User1 blog')
    await page.fill('[data-testid="author-input"]', 'User One')
    await page.fill('[data-testid="url-input"]', 'http://example.com')
    await page.click('[data-testid="create-button"]')

    const blog = page.locator('.blog', { hasText: 'User1 blog' })
    await blog.locator('button', { hasText: 'view' }).click()

    await expect(blog.locator('button', { hasText: 'remove' })).toBeVisible()

    await page.click('[data-testid="logout-button"]')

    await page.fill('[data-testid="username"]', user2.username)
    await page.fill('[data-testid="password"]', user2.password)
    await page.click('[data-testid="login-button"]')

    const blogUser2 = page.locator('.blog', { hasText: 'User1 blog' })
    await blogUser2.locator('button', { hasText: 'view' }).click()
    await expect(blogUser2.locator('button', { hasText: 'remove' })).toHaveCount(0)
  })

  test('blogs are ordered by likes, highest first', async ({ page, request }) => {
    const user = {
      username: 'testuser',
      password: 'password123',
    }

    const tokenResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: user.username, password: user.password },
    })
    const token = (await tokenResponse.json()).token

    const blogsToCreate = [
      { title: 'Blog Low Likes', author: 'Author1', url: 'http://url1.com', likes: 1 },
      { title: 'Blog Medium Likes', author: 'Author2', url: 'http://url2.com', likes: 5 },
      { title: 'Blog High Likes', author: 'Author3', url: 'http://url3.com', likes: 10 },
    ]

    for (const blog of blogsToCreate) {
      await request.post('http://localhost:3003/api/blogs', {
        data: blog,
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    await page.goto('http://localhost:5173')
    await page.getByText('Blogs')

    const blogs = page.locator('.blog-title-author')
    await blogs.first().waitFor()

    const firstText = await blogs.first().innerText()
    const lastText = await blogs.last().innerText()

    expect(firstText).toContain('Blog High Likes')
    expect(lastText).toContain('Blog Low Likes')
  })
})
