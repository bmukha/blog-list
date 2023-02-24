const Blog = require('../models/blog')


const dummy = () => 1

const totalLikes = blogs => blogs.reduce((acc, curr) => acc+=curr.likes, 0)

const favoriteBlog = blogs => blogs
  .map(({ title, author, likes }) => ({ title, author, likes }))
  .reduce((acc, curr) => curr.likes > acc.likes ? curr : acc)

const mostBlogs = blogs => {
  const blogsCount = blogs
    .reduce((acc, curr) => {
      acc[curr.author] ? acc[curr.author]++ : acc[curr.author] = 1
      return acc
    }, {})
  const authorArr = Object.entries(blogsCount)
    .reduce((acc, curr) => curr[1] > acc[1] ? curr : acc)
  return { author: authorArr[0],
    blogs: authorArr[1] }
}

const mostLikes = blogs => {
  const likesCount = blogs
    .reduce((acc, curr) => {
      acc[curr.author] ? acc[curr.author]+= curr.likes : acc[curr.author] = curr.likes
      return acc
    }, {})
  const authorArr = Object.entries(likesCount)
    .reduce((acc, curr) => curr[1] > acc[1] ? curr : acc)
  return { author: authorArr[0],
    likes: authorArr[1] }
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogs,
  blogsInDb
}