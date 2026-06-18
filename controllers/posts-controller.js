/* Show blog post form */
async function post_get(req, res) {
  res.json({
    success: true,
    title: 'New Post',
    msg: 'Get new blog post form'
  })
}

export { post_get }
