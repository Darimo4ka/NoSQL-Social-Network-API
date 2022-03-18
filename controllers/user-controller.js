const { User, Thought } = require("../models");
// const { param } = require("../routes");

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find()
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // update user information using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Delete a user and associated apps
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : Thought.deleteMany({ _id: { $in: user.applications } })
      )
      .then(() => res.json({ message: "User and associated apps deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  //   add a friend to user
  addFriend(req, res) {
    console.log("You are adding an friend");
    console.log(req.body);
    User.findOneAndUpdate({ _id: req.params.userId },
      { $addToSet: { friends: params.friendId } },
      { runValidators: true, new: true })
      .then((user) =>
        !user
          ? res.status(404) .json({ message: "No User found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // remove a friend from user
   removeFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.friendId },
      { $pull: { friends: req.params.userId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this friend ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
module.exports = userController;