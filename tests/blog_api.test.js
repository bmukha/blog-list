const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.blogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.blogs.length)
}, 10000000)

test('id property is defined', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
}, 10000000)

const newTestBlog = {
  title: 'New Test Blog',
  author: 'Bohdan Mukha',
  url: 'http://github.com/bmukha',
  likes: 777
}

test('new post is successfully created', async () => {
  await api.post('/api/blogs', newTestBlog)
  const response = await api.get('/api/blogs', newTestBlog)
  expect(response.body.length).toBe(helper.blogs.length + 1)
}, 10000000)


afterAll(async () => {
  await mongoose.connection.close()
})