const auth = require('../middlewares/authJwt')
const controllers = require('../controllers/exercise.controller')

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
		next()
	})
	app.get('/trainerexercises', auth.verifyToken, controllers.getExercise)

	app.post('/exerciseAdd', auth.verifyToken, controllers.checkDuplicateExerciseOrTrainer, controllers.exerciseAdd)
	app.put(
		'/trainerexercises/:id/:exerciseName?',
		[auth.verifyToken, auth.isTrainer],
		controllers.checkDuplicateExerciseOrTrainer,
		controllers.editExercise
	)
	app.delete('/trainerexercises/:id/:exerciseName?', [auth.verifyToken, auth.isTrainer], controllers.deleteExercise)
	app.get('/checkDuplicates', controllers.checkDuplicateExerciseOrTrainer)
}
