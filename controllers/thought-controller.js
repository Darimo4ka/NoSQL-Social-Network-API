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
createThought({ params, body }, res) {
    Thought.create(body)
        .then(createdThought => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: createdThought._id } },
                { new: true }
            );
        })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: "Thought created but not attached to the user" });
            }
            res.json({ message: "Thought successfully created" });
        })
        .catch(err => {
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
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then( (thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE /api/thoughts/:id/reactions
  deleteReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: body.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json({ message: "Successfully deleted the reaction" });
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;
