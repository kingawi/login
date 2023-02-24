const db = require('../model')
const Exercise = db.exercise

exports.checkDuplicateExerciseOrTrainer = async (req, res, next) => {
	try {
		const exercise = await Exercise.findOne({ exerciseName: req.body.exerciseName, exerciseCreator: req.userId })
		//if exercise exist return error
		if (exercise) {
			res.status(404).send({
				message: `We're sorry, this exercise name is already in use.`,
			})
		} else {
			next()
		}
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}
exports.getExercise = async (req, res) => {
	try {
		const trainerExercises = await Exercise.find({ exerciseCreator: req.userId }).select({
			exerciseName: 1,
			exerciseDescription: 1,
			exerciseAddingDate: 1,
			exerciseCreator: 1,
			_id: 1,
		})
		res.send(trainerExercises)
	} catch (err) {
		res.status(404).json({ message: `Sorry, we didn't find any exercise in your library. ` })
	}
}
exports.exerciseAdd = async (req, res) => {
	try {
		console.log(req.userId, 'sprawdzam usera')
		const exercise = new Exercise({
			exerciseName: req.body.exerciseName,
			exerciseDescription: req.body.exerciseDescription,
			exerciseCreator: req.body.userId,
		})

		if (req.body.exerciseName == null || req.body.exerciseDescription == null) {
			console.log('Please fill all required fields!')
		}
		exercise.exerciseCreator = req.userId
		await exercise.save()
		res.send({ message: `Exercise ${exercise} was added to your exercises library successfully!` })
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}
exports.deleteExercise = async (req, res) => {
	try {
		const exercise = await Exercise.findOneAndDelete(
			{ _id: req.params.id, exerciseCreator: req.userId },
			{
				$deleteOne: {
					exerciseName: req.body.exerciseName,
					exerciseDescription: req.body.exerciseDescription,
				},
			}
		)
		res.send({ message: `Exercise ${exercise.exerciseName} has been deleted.` })
	} catch (err) {
		res.status(404).json({ message: `Sorry, we didn't find exercise ${req.params} in your library. ` })
	}
}
exports.editExercise = async (req, res) => {
	try {
		const exercise = await Exercise.findOneAndUpdate(
			{ _id: req.params.id, exerciseCreator: req.userId },
			{
				$set: {
					exerciseName: req.body.exerciseName,
					exerciseDescription: req.body.exerciseDescription,
				},
			}
		)
		res.send({ message: `Exercise ${exercise.exerciseName} has been updated.` })
	} catch (err) {
		res.status(500).json({ message: err })
	}
}
