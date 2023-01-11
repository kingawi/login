const { verifySignUp } = require('../middlewares')
const controller = require('../controllers/auth.controller')

module.exports = function (app) {
	app.use(function (req, res, next) {
		//???
		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
		next()
	})

	//jezeli mamy sciezke url signup to zweryfikuj czy nazwa i email istnieja juz i sprawdz czy przypisano odpowiednia role
	app.post(
		'/api/auth/signup',
		[verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
		controller.signup //zapisuje dane uzytkownika w bazie
	)

	app.post('/api/auth/signin', controller.signin)

	app.post('/api/auth/signout', controller.signout)
}
