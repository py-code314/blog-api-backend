import {
  sign_up_get,
  sign_up_post,
  log_in_get,
  log_in_post,
} from './auth-controller.js'
import {
  getNewPostForm,
  createNewPost,
  getPostById,
  getEditPostForm,
  updatePost,
  deletePost,
} from './posts-controller.js'
import {
  getNewCommentForm,
  createNewComment,
  getEditCommentForm,
  updateComment,
  deleteComment,
} from './comments-controller.js'
import {
  getNewProfileForm,
  createNewProfile,
  getProfileById,
  getEditProfileForm,
  updateProfile,
  deleteProfile
} from './profiles-controller.js'
import {
  getNewCategoryForm,
  createNewCategory,
  getAllCategories,
  getEditCategoryForm,
  updateCategory,
  deleteCategory

} from './categories-controller.js'
import {
  getNewTagForm,
  createNewTag,
  getAllTags


} from './tags-controller.js'

export {
  sign_up_get,
  sign_up_post,
  log_in_get,
  log_in_post,
  getNewPostForm,
  createNewPost,
  getPostById,
  getEditPostForm,
  updatePost,
  deletePost,
  getNewCommentForm,
  createNewComment,
  getEditCommentForm,
  updateComment,
  deleteComment,
  getNewProfileForm,
  createNewProfile,
  getProfileById,
  getEditProfileForm,
  updateProfile,
  deleteProfile,
  getNewCategoryForm,
  createNewCategory,
  getAllCategories,
  getEditCategoryForm,
  updateCategory,
  deleteCategory,
  getNewTagForm,
  createNewTag,
  getAllTags
}
