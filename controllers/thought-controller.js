const { User, Thought, Reaction } = require("../models");

const thoughtController = {
  // GET /api/thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET /api/thoughts/:id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // POST /api/thoughts
  createThought( {body} , res) {
    Thought.create(body)
      .then((createdThought) => {
        console.log(createdThought);
        return User.findOneAndUpdate(
          { username: createdThought.username },
          { $push: { thoughts: createdThought._id } },
          { new: true }
        );
      })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res
            .status(404)
            .json({ message: "Thought created but not attached to the user" });
        }
        res.json({ message: "Thought successfully created" });
      })

      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },
  // PUT /api/thoughts/:id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.status(400).json(err));
  },

  // DELETE /api/thoughts/:id
  deleteThought({ params }, res) {
    // delete the thought
    Thought.findOneAndDelete({ _id: params.id })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        // delete the reference to deleted thought in user's thought array
        User.findOneAndUpdate(
          { username: thought.username },
          { $pull: { thoughts: params.id } }
        )
          .then(() => {
            res.json({ message: "Successfully deleted the thought" });
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  },

  // POST /api/thoughts/:id/reactions
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {
        $addToSet: {
          reactions: {
            username: req.body.username,
            reactionBody: req.body.reactionBody,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with that ID!" })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // DELETE /api/thoughts/:id/reactions
  deleteReaction(req, res) {
    console.log(req.params.reactionId);
     Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true, runValidators: true }
     )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID!'})
                : res.status(200).json({ message: 'Reaction deleted and removed from associated thought'})
        )
        .catch((err) => res.status(500).json(err));
    }
};

module.exports = thoughtController;
