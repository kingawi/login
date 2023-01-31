const db = require('../model')

const User = db.user
const Exercise = db.exercise

exports.exerciseAdd = (req, res) => {
	const exercise = new Exercise({
		exerciseName: req.body.exerciseName,
		description: req.body.exerciseDescription,
		exerciseCreator: req.body.user._id,
	})
	//przesledzic zmienna exercise -> cos tu nie styka
	exercise.save((err, exercise) => {
		if (err) {
			res.status(500).send({ message: err })
			return
		} //rozdzielic, zwlaszcza creatora zeby zobaczyc czy dziala
    //czy ify z nullami sa potrzebne skoro w modelu jest przy tych dokumentach required
		if (req.body.exerciseName === null || exercise.req.body.exerciseDescription === null) {
			console.log('Please fill all required fields!')
		} else req.body.exerciseCreator === null
		if (err) {
			res.status(500).send({ message: err })
			return
		}

		exercise.save(err => {
			if (err) {
				res.status(500).send({ message: err })
				return
			}

			res.send({ message: `Exercise ${exercise.exerciseName} was added to your exercises library successfully!` })
		})
	})
}
