/* Show blog post form */
async function post_get(req, res) {
  res.json({
    title: 'New Post',
  })
}

export {post_get}
