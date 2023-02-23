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
}, 2000)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 2000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.blogs.length)
}, 2000)

test('id property is defined', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
}, 2000)

test('new blog is successfully created', async () => {

  const newTestBlog = {
    title: 'New Test Blog',
    author: 'Bohdan Mukha',
    url: 'http://github.com/bmukha',
    likes: 777
  }
  await api
    .post('/api/blogs')
    .send(newTestBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.blogs.length + 1)
}, 5000)


test('new post without likes defaults likes to 0', async () => {
  const newTestBlogWithoutLikes = {
    title: 'New Test Blog without likes',
    author: 'Bohdan Mukha',
    url: 'http://github.com/bmukha',
  }
  const response = await api
    .post('/api/blogs')
    .send(newTestBlogWithoutLikes)

  expect(response.body.likes).toBe(0)
}, 2000)


test('new post without title results in error 400 Bad Request', async () => {
  const newTestBlogWithoutTitle = {
    author: 'Bohdan Mukha',
    url: 'http://github.com/bmukha',
  }
  const response = await api
    .post('/api/blogs')
    .send(newTestBlogWithoutTitle)
  expect(response.status).toBe(400)
}, 2000)

test('new post without url results in error 400 Bad Request', async () => {
  const newTestBlogWithoutTitle = {
    title: 'Some title',
    author: 'Bohdan Mukha',
  }
  const response = await api
    .post('/api/blogs')
    .send(newTestBlogWithoutTitle)
  expect(response.status).toBe(400)
}, 2000)

afterAll(async () => {
  await mongoose.connection.close()
})