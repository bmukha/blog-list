const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { user: userId } = request

  if(!userId) {
    return response.status(401).json({ error: 'user not found' })
  }

  const { title, author, url, likes } = request.body
  const user = await User.findById(userId)
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
  const { id } = request.params
  const { user: userId } = request


  const blog = await Blog.findById(id)

  if(!blog) {
    return response.status(404).end()
  }

  if(!userId) {
    return response.status(401).json({ error: 'user not found' })
  }

  const user = await User.findById(userId)

  if ( blog.user.toString() !== user.id.toString() ) {
    return response.status(401).json({ error: 'wrong user!' })

  }
  await blog.remove()
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
