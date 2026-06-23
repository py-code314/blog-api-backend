/* Show profile form */
async function getNewProfileForm(req, res) {
  res.json({
    success: true,
    title: 'New Profile',
    msg: 'Get new profile form',
  })
}

export {getNewProfileForm}