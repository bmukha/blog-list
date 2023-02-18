const dummy = () => 1

const totalLikes = blogs => blogs.reduce((acc, curr) => acc+=curr.likes, 0)

const favoriteBlog = blogs => blogs.reduce((acc, curr) => curr.likes > acc.likes ? curr : acc)

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}