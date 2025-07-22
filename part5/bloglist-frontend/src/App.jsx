import { useState, useEffect } from 'react'
import loginService from './services/login'
import blogService from './services/blogService'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      showNotification('Login successful')
    } catch (error) {
      showNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      showNotification(`A new blog '${newBlog.title}' by ${newBlog.author} added`)
    } catch (error) {
      showNotification('Error creating blog', 'error')
    }
  }

  const updateBlog = async (id, updatedData) => {
    const updated = await blogService.update(id, updatedData)
    setBlogs(blogs.map((b) => (b.id === id ? { ...updated, user: b.user } : b)))
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find((b) => b.id === id)

    const ok = window.confirm(`Remove blog '${blogToDelete.title}' by ${blogToDelete.author}?`)
    if (!ok) return

    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((b) => b.id !== id))
      showNotification(`Blog '${blogToDelete.title}' removed`)
    } catch (error) {
      showNotification('Error deleting blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification} testId={'notification'} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin} data-testid='login-form'>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
              data-testid='username'
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
              data-testid='password'
            />
          </div>
          <button type='submit' data-testid='login-button'>
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification} testId={'notification'} />
      <h2>Blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout} data-testid='logout-button'>
        Logout
      </button>
      <Togglable buttonLabel='Create new blog'>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        ))}
    </div>
  )
}

export default App
