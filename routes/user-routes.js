const router = require('express').Router(),
  { returnUser } = require('../middleware/returnUser'),
  { postLoginUser,
    postRegisterUser,
    putUpdateUser,
    getMyInfo,
    deleteUser } = require('../controllers/user-controllers');

router
  .route("/")
  .get(returnUser, getMyInfo);

router
  .route("/login")
  .post(postLoginUser)

router
  .route("/register")
  .post(postRegisterUser);

router
  .route("/edit")
  .put(returnUser, putUpdateUser);

router
  .route("/delete_account")
  .delete(returnUser, deleteUser);

module.exports = router;