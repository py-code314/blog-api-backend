/* Show new tag form */
async function getNewTagForm(req, res) {
  res.json({
    success: true,
    title: 'New Tag',
    msg: 'Get new tag form',
  })
}

export {getNewTagForm}
