const express = require('express')
const { verifyToken } = require('../middlewares/authJwt')
const auth = require('../middlewares/authJwt')
const db = require('../model')
const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const controllers = require('../controllers/exercise.controller')

// const router = express.Router();

const ROLES = db.ROLES
const User = db.user
const Exercise = db.exercise

//post
//pobierz wszystkie - get
//update rekordu
//delete
//!!!!! dodac module export

//!!!!!!dodaj tutaj funkcje jako zmienne i zrob oddzielnie sciezki
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
		next()
	})
	app.get('/trainerexercises', controllers.getExercise)

	app.post('/exerciseAdd', controllers.exerciseAdd)
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
