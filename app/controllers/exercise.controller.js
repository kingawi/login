const db = require('../model')
const ROLES = db.ROLES
const User = db.user
const Exercise = db.exercise

checkDuplicateUExerciseName = (req, res, next) => {
	// Username
	Exercise.findOne({
		exerciseName: req.body.exerciseName,
	}).exec((err, Exercise) => {
		//exec() method executes a search for a match in a specified string and returns a result array, or null
		if (err) {
			//500 - internal server error
			res.status(500).send({ message: err })
			return
		}

		if (Exercise) {
			res.status(400).send({ message: 'Przepraszamy, ćwiczenie o podanej nazwie już istnieje' })
			return
		}
		// jak zrobic w tym miejscu, zeby szukalo po bazie cwiczen trenera ktory dodaje cwiczenie?
		User.findOne({
			email: req.body.email,
		}).exec((err, user) => {
			if (err) {
				res.status(500).send({ message: err })
				return
			}

			if (user) {
				res.status(400).send({ message: 'Przepraszamy, wybrany email jest już w użyciu' })
				return
			}

			next()
		})
	})
}

const checkTrainerRole = (req, res) => {
	if (req.body.role != 'trainer') {
		return res.status(403).json({ message: 'Sorry, you do not have permission for below action' })
	} else {
		next()
	}
}
