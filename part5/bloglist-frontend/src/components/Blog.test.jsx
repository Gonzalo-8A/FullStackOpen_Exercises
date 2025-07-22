import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    id: '123',
    title: 'React Patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: { id: 'u1', name: 'Michael', username: 'mchan' },
  }

  const mockUpdate = vi.fn ? vi.fn() : vi.fn()
  const mockDelete = vi.fn ? vi.fn() : vi.fn()
  const user = { username: 'mchan' }

  render(<Blog blog={blog} updateBlog={mockUpdate} deleteBlog={mockDelete} user={user} />)

  expect(screen.getByText('React Patterns Michael Chan')).toBeDefined()

  expect(screen.queryByText('https://reactpatterns.com/')).toBeNull()

  expect(screen.queryByText('likes 7')).toBeNull()
})

test('shows url and likes when the view button is clicked', async () => {
  const blog = {
    id: '123',
    title: 'React Patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: { id: 'u1', name: 'Michael', username: 'mchan' },
  }

  const mockUpdate = vi.fn()
  const mockDelete = vi.fn()
  const user = { username: 'mchan' }

  render(<Blog blog={blog} updateBlog={mockUpdate} deleteBlog={mockDelete} user={user} />)

  expect(screen.queryByText('https://reactpatterns.com/')).toBeNull()
  expect(screen.queryByText('likes 7')).toBeNull()

  const userClick = userEvent.setup()
  const button = screen.getByText('view')
  await userClick.click(button)

  // Tras clicar el botón, url y likes sí están visibles
  expect(screen.getByText('https://reactpatterns.com/')).toBeDefined()
  expect(screen.getByText('likes 7')).toBeDefined()
})

test('calls the like handler twice if like button is clicked twice', async () => {
  const blog = {
    id: '123',
    title: 'React Patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: { id: 'u1', name: 'Michael', username: 'mchan' },
  }

  const mockUpdate = vi.fn()
  const mockDelete = vi.fn()
  const user = { username: 'mchan' }

  render(<Blog blog={blog} updateBlog={mockUpdate} deleteBlog={mockDelete} user={user} />)

  const userEventInstance = userEvent.setup()

  const viewButton = screen.getByText('view')
  await userEventInstance.click(viewButton)

  const likeButton = screen.getByText('like')
  await userEventInstance.click(likeButton)
  await userEventInstance.click(likeButton)

  expect(mockUpdate).toHaveBeenCalledTimes(2)
})
