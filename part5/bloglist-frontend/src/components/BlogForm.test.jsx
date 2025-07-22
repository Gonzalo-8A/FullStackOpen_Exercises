import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

test('calls createBlog with correct details when form is submitted', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByRole('textbox', { name: /title/i })
  const inputAuthor = screen.getByRole('textbox', { name: /author/i })
  const inputUrl = screen.getByRole('textbox', { name: /url/i })
  const createButton = screen.getByRole('button', { name: /create/i })

  await user.type(inputTitle, 'Testing form title')
  await user.type(inputAuthor, 'Test Author')
  await user.type(inputUrl, 'http://testurl.com')
  await user.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing form title',
    author: 'Test Author',
    url: 'http://testurl.com',
  })
})
