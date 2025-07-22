const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Blog de prueba',
    author: 'Midudev',
    url: 'https://midu.dev',
    likes: 7,
  },
  {
    title: 'Otro blog',
    author: 'Dijkstra',
    url: 'https://cs.theory',
    likes: 4,
  },
]

let token = ''
let userId = ''

beforeAll(async () => {
  await User.deleteMany({})

  const newUser = {
    username: 'testgonzalo',
    name: 'Test Gonzalo',
    password: 'testpass',
  }

  const userResponse = await api.post('/api/users').send(newUser)
  userId = userResponse.body.id

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password,
  })
  token = loginResponse.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const user = await User.findById(userId)

  user.blogs = []

  for (const blog of initialBlogs) {
    const blogObj = new Blog({ ...blog, user: user._id })
    const savedBlog = await blogObj.save()
    user.blogs = user.blogs.concat(savedBlog._id)
  }

  await user.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined()
    expect(blog._id).toBeUndefined()
  })
})

test('a valid blog can be added with token', async () => {
  const newBlog = {
    title: 'Dogs Blog',
    author: 'Gonzalo',
    url: 'http://dogsblog.com',
    likes: 50,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map((r) => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain('Dogs Blog')
})

test('adding a blog fails with status 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'Intruder',
    url: 'http://unauthorized.com',
    likes: 10,
  }

  await api.post('/api/blogs').send(newBlog).expect(401)
})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog = {
    title: 'Cats Blog',
    author: 'Anais',
    url: 'http://nolikes.com',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  expect(response.body.likes).toBe(0)
})

test('blog without title error 400', async () => {
  const newBlog = {
    author: 'Gonzalo',
    url: 'http://notitle.com',
    likes: 2,
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
})

test('blog without url error 400', async () => {
  const newBlog = {
    title: 'Dogs',
    author: 'Gonzalo',
    likes: 2,
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
})

test('a blog can be deleted', async () => {
  const loginResponse = await api.post('/api/login').send({
    username: 'testgonzalo',
    password: 'testpass',
  })

  const token = loginResponse.body.token

  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  const ids = blogsAtEnd.body.map((b) => b.id)

  expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length - 1)
  expect(ids).not.toContain(blogToDelete.id)
})

test("a blog's likes can be updated", async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const { user, ...rest } = blogToUpdate

  const updatedData = {
    ...rest,
    likes: blogToUpdate.likes + 1,
  }

  const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedData).expect(200)

  expect(response.body.likes).toBe(blogToUpdate.likes + 1)
})

afterAll(async () => {
  await mongoose.connection.close()
})
