/* Show new comment form */
async function getNewCommentForm(req, res) {
  res.json({
    success: true,
    msg: 'Get new comment form',
  })
}

export {getNewCommentForm}
