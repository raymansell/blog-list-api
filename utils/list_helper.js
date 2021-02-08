const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  const mostLikedBlog = blogs.reduce((prev, curr) => {
    return prev.likes > curr.likes ? prev : curr;
  });

  const { id, url, ...formatted } = mostLikedBlog;
  return formatted;
};

module.exports = { totalLikes, favoriteBlog };
