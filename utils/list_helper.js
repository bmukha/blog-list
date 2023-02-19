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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}