const mongoose = require("mongoose");

const Exercise = mongoose.model(
  "Exercise",
  new mongoose.Schema({
    exerciseName: {
        type: String,
        required: true,
        minLength: [4, 'Name should be minimum of 4 characters'],
    },
    description: {
        type: String,
        required: true,
        minLength: [20, 'Please describe your exercise accurately.'],
    },
  })
);

module.exports = Exercise;