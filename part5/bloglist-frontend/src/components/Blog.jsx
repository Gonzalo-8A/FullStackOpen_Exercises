import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = () => {
    const updatedBlog = {
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      user: blog.user && blog.user.id ? blog.user.id : blog.user,
    }

    updateBlog(blog.id, updatedBlog)
  }

  const handleRemove = () => deleteBlog(blog.id)

  const showRemoveButton = user && blog.user && user.username === blog.user.username

  return (
    <div className='blog' style={blogStyle}>
      <div className='blog-title-author'>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className='blog-details'>
          <div>{blog.url}</div>
          <div className='likes-count' data-testid='likes-count'>
            likes {blog.likes}{' '}
            <button onClick={handleLike} aria-label='like'>
              like
            </button>
          </div>
          <div>{blog.user && blog.user.name}</div>
          {showRemoveButton && (
            <button onClick={handleRemove} data-testid='remove-button'>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        username: PropTypes.string,
      }),
      PropTypes.string,
    ]),
  }).isRequired,
  deleteBlog: PropTypes.func.isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
}

export default Blog
