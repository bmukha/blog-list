const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.blogs.length)
  })

  test('id property is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of new blog', () => {
  test('succeeds with valid data', async () => {
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
  })

  test('defaults likes to 0 if likes property is not provided', async () => {
    const newTestBlogWithoutLikes = {
      title: 'New Test Blog without likes',
      author: 'Bohdan Mukha',
      url: 'http://github.com/bmukha',
    }
    const response = await api
      .post('/api/blogs')
      .send(newTestBlogWithoutLikes)

    expect(response.body.likes).toBe(0)
  })

  test('results in error 400 Bad Request if title is not provided', async () => {
    const newTestBlogWithoutTitle = {
      author: 'Bohdan Mukha',
      url: 'http://github.com/bmukha',
    }
    const response = await api
      .post('/api/blogs')
      .send(newTestBlogWithoutTitle)
    expect(response.status).toBe(400)
  })

  test('results in error 400 Bad Request if url is not provided', async () => {
    const newTestBlogWithoutTitle = {
      title: 'Some title',
      author: 'Bohdan Mukha',
    }
    const response = await api
      .post('/api/blogs')
      .send(newTestBlogWithoutTitle)
    expect(response.status).toBe(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.blogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})