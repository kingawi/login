const db = require('../model')
const ROLES = db.ROLES
const User = db.user
const Exercise = db.exercise

//TO DO: edit function to check double exercise name in specific trainer collection

exports.checkDuplicateExerciseOrTrainer = async (req, res) => {
	// Username
	try {
		const exercise = await Exercise.findOne({
			$and: [{ exerciseName: req.body.exerciseName }, { exerciseCreator: req.body._id }],
		})
		if (exercise) {
			res.status(400).send({
				message:
					exercise.exerciseName === req.body.exerciseName
						? 'Przepraszamy, wybrana nazwa ćwiczenia jest w użyciu'
						: 'Przepraszamy, wybrana nazwa ćwiczenia jest w użyciu',
			})
		}
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}

exports.getExercise = (req, res) => {
	const trainerExercises = [] //
	if (db.exerciseCreator === req.body._id) {
		trainerExercises.push(
			Exercise.find({ exerciseCreator: req.body._id }, (err, Exercise) => {
				if (err) {
					res.status(500).send({ message: err })
					return
				} else {
					console.log(Exercise)
				}
			}).select({
				exerciseName: 1,
				exerciseDescription: 1,
				exerciseAddingDate: 1,
				exerciseCreator: 1,
				_id: 1,
			})
		)

		console.log(Exercise)
		// console.log(trainerExercises)
		res.end()
	} else {
		res.status(404).send({ message: 'Nie znaleziono ćwiczeń dodanych przez trenera' })
	}
}

exports.exerciseAdd = (req, res) => {
	const exercise = new Exercise({
		exerciseName: req.body.exerciseName,
		exerciseDescription: req.body.exerciseDescription,
		// exerciseCreator: req.body._id,
	})
	//przesledzic zmienna exercise
	exercise.save((err, exercise) => {
		if (err) {
			res.status(500).send({ message: err })
			return
		} //rozdzielic, zwlaszcza creatora zeby zobaczyc czy dziala
		//czy ify z nullami sa potrzebne skoro w modelu jest przy tych dokumentach required
		if (req.body.exerciseName == null || req.body.exerciseDescription == null) {
			console.log('Please fill all required fields!')
		}
		if (err) {
			res.status(500).send({ message: err })
			return
		}
		exercise.exerciseCreator = req.userId
		res.send({ message: `Exercise ${exercise} was added to your exercises library successfully!` })
	})
}

const checkTrainerRole = (req, res) => {
	if (req.body.role != 'trainer') {
		return res.status(403).json({ message: 'Sorry, you do not have permission for below action' })
	} else {
		next()
	}
}
