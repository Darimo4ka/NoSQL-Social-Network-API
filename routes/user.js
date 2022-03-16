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
router.route("/").get(getAllUsers).post(createUser);
// // /api/user iformation update
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
//  api for user related data like friend add and delete
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;
