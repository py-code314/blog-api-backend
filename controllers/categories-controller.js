/* Show category form */
async function getNewCategoryForm(req, res) {
  res.json({
    success: true,
    title: 'New Category',
    msg: 'Get new category form',
  })
}

export { getNewCategoryForm }
