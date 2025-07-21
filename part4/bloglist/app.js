require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const { tokenExtractor } = require('./utils/middleware')

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())

app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// app.get('/api/blogs', (req, res) => {
//   Blog.find({}).then((blogs) => {
//     res.json(blogs)
//   })
// })

// app.post('/api/blogs', async (req, res) => {
//   const { title, url } = req.body

//   if (!title || !url) {
//     return res.status(400).end()
//   }

//   const blog = new Blog(req.body)
//   const savedBlog = await blog.save()
//   res.status(201).json(savedBlog)
// })

// app.delete('/api/blogs/:id', async (req, res) => {
//   await Blog.findByIdAndDelete(req.params.id)
//   res.status(204).end()
// })

// app.put('/api/blogs/:id', async (req, res) => {
//   const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     context: 'query',
//   })
//   res.json(updatedBlog)
// })

module.exports = app
