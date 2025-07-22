const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({ username: 'gonzalo', passwordHash: 'hashedpassword' })
  await user.save()
})

test('creation fails with status 400 if username is too short', async () => {
  const newUser = {
    username: 'go',
    name: 'Gonzalo Ochoa',
    password: '123456',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('creation fails with status 400 if password is too short', async () => {
  const newUser = {
    username: 'gonzaloochoa',
    name: 'Gonzalo Ochoa',
    password: '12',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('creation fails with status 400 if username is not unique', async () => {
  const newUser = {
    username: 'gonzalo',
    name: 'Gonzalo Ochoa',
    password: '123456',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})
