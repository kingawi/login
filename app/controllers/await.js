exerciseAdd = async (req, res) => {
	try {
		console.log(req.userId, 'sprawdzam usera')
		const exercise = new Exercise({
			exerciseName: req.body.exerciseName,
			exerciseDescription: req.body.exerciseDescription,
			exerciseCreator: req.body.userId,
		})
		//przesledzic zmienna exercise
		exercise.save((exercise, next) => {
			if (req.body.exerciseName == null || req.body.exerciseDescription == null) {
				console.log('Please fill all required fields!')
			} else {
				next()
			}

			exercise.exerciseCreator = req.userId
			res.send({ message: `Exercise ${exercise} was added to your exercises library successfully!` })
		})
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}

exports.exerciseAdd = (req, res) => {
	console.log(req.userId, 'sprawdzam usera')
	const exercise = new Exercise({
		exerciseName: req.body.exerciseName,
		exerciseDescription: req.body.exerciseDescription,
		exerciseCreator: req.body.userId,
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

