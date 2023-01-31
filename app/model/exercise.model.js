const mongoose = require('mongoose')
//w ten sposob tworzymy kolekcje w MongoDb i ustalamy jakie kolumny beda
const Exercise = mongoose.model(
	'Exercise',
	new mongoose.Schema({
		exerciseName: {
			type: String,
			required: true,
			minLength: [4, 'Name should be minimum of 4 characters'],
		},
		exerciseDescription: {
			type: String,
			required: true,
			minLength: [20, 'Please describe your exercise accurately.'],
		},
		exerciseCreator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
		},
		exerciseAddingDate: {
			type: Date,
			default: Date.now,
		},
    
	})
)

module.exports = Exercise
