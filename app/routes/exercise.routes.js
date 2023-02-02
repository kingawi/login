const express = require('express')
const db = require('../model')
// const router = express.Router();

const ROLES = db.ROLES
const User = db.user
const Exercise = db.exercise

//post
//pobierz wszystkie - get
//update rekordu
//delete
//!!!!! dodac module export
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
		next()
	})
	app.get('/trainerExercises', (req, res) => {
		const trainerExercises = [] //
		if (db.exerciseCreator === req.body._id) {
			trainerExercises.push(
				Exercise.find({ exerciseCreator: req.body._id }).select({
					exerciseName: 1,
					exerciseDescription: 1,
					exerciseAddingDate: 1,
					exerciseCreator: 1,
					_id: 1,
				})
			)
			console.log(trainerExercises)
			res.end()
		} else {
			res.status(404).send({ message: 'Nie znaleziono ćwiczeń dodanych przez trenera' })
		}
	})

	app.post('/exerciseAdd', (req, res) => {
		const exercise = new Exercise({
			exerciseName: req.body.exerciseName,
			exerciseDescription: req.body.exerciseDescription,
			exerciseCreator: req.body._id,
		})
		//przesledzic zmienna exercise -> cos tu nie styka
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
			exercise.exerciseCreator = req.body._id //nie dziala, do poprawy
			exercise.save(err => {
				if (err) {
					res.status(500).send({ message: err })
					return
				}

				res.send({ message: `Exercise ${exercise} was added to your exercises library successfully!` })
			})
		})
	})
}

// app.get('/trainerExercise', async (req, res) => {
// 	try {
// 		const trainerExercise = await User.find().populate({
// 			path: 'exercises',
// 			select: 'exerciseName exerciseDescription',
// 		})

// 		res.status(200).json({ data: exercises })
// 		console.log(trainerExercise, 'dziala bez s')
// 	} catch (error) {
// 		res.status(500).json({ error })
// 	}
// })

//-jak wrzucic wyswietlone wyniki do tablicy trainerExercises i pozniej to wyswietlic?
//zrobic petle for i in db.xercise krotsze od exe.length dodaj do tablicy i cgl tablice
//exec() method executes a search for a match in a specified string and returns a result array, or null

// 	const Exercise = db.exercise
// 	Exercise.find({
// 		exerciseCreator: req.body.exerciseCreator, //czy tu na pewno ma byc req.body? co jak user bedzie chcial wyszukac?
// 	}).exec((err, exercise) => {
// 		//czy tu na pewno ma byc error?co zamiast user?
// 		//exec() method executes a search for a match in a specified string and returns a result array, or null
// 		if (err) {
// 			res.status(400).send({ message: err })
// 			return
// 		}
// 	})
