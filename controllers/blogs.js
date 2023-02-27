const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = await new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  }).save()

  user.blogs = [...user.blogs, blog._id]
  await user.save()

  response.status(201).json(blog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const { id } = request.params

  const blog = {
    title,
    author,
    url,
    likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })

  response.json(updatedBlog)
})

module.exports = blogsRouter
