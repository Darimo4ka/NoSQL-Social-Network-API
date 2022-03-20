const router = require("express").Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/user-controller");
// api routes
router.route("/")
.get(getAllUsers)
.post(createUser);
// /api/user iformation update
router.route("/:userId")
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

//  api for user related data like friend add and delete
// /api/users/:id/friends/:friendid

router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

// router.route("/:userId/friends/:friendId")
// .post(addFriend)
// .delete(removeFriend);

module.exports = router;
