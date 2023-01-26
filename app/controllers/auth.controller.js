const config = require('../config/auth.config')
const db = require('../model')
const { user: User, role: Role, refreshToken: RefreshToken } = db

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.signup = (req, res) => {
	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8),
	})

	user.save((err, user) => {
		if (err) {
			res.status(500).send({ message: err }) //jezeli bedzie zla rola przy rejestracji to pokaze status 500
			return
		}
		if (req.body.roles) {
			Role.find(
				{
					name: { $in: req.body.roles }, //ten zapis iteruje po tablicy z rolami
				},
				(err, roles) => {
					if (err) {
						res.status(500).send({ message: err })
						return
					}
					//przyporzadkowuje role do tworzonego uzytkownika
					user.roles = roles.map(role => role._id)
					user.save(err => {
						if (err) {
							res.status(500).send({ message: err })
							return
						}

						res.send({ message: 'User was registered successfully!' })
					})
				}
			)
		} else {
			Role.findOne({ name: 'user' }, (err, role) => {
				if (err) {
					res.status(500).send({ message: err })
					return
				}
				user.roles = [role._id]
				user.save(err => {
					if (err) {
						res.status(500).send({ message: err })
						return
					}

					res.send({ message: 'User was registered successfully!' })
				})
			})
		}
	})
}

exports.signin = (req, res) => {
	User.findOne({
		username: req.body.username,
	}) //populate() - process of replacing the specified path in the document of one collection with the actual document from the other collection
		.populate('roles', '-__v')
		//exec() - executes a search for a match in a specified string and returns a result array, or null
		.exec(async (err, user) => {
			if (err) {
				res.status(500).send({ message: err })
				return
			}

			if (!user) {
				return res.status(404).send({ message: 'User Not found.' })
			}

			let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: 'Invalid Password!',
				})
			}
			let token = jwt.sign({ id: user.id }, config.secret, {
				expiresIn: config.jwtExpiration,
			})
			let refreshToken = await RefreshToken.createToken(user)
			let authorities = []
			//do pustej tablicy powyzej dodaj rolę i nazwę roli
			for (let i = 0; i < user.roles.length; i++) {
				authorities.push('ROLE_' + user.roles[i].name.toUpperCase())
			}
			req.session.token = token

			res.status(200).send({
				id: user._id,
				username: user.username,
				email: user.email,
				roles: authorities,
				accessToken: token,
				refreshToken: refreshToken,
			})
		})
}
exports.refreshToken = async (req, res) => {
	const { refreshToken: requestToken } = req.body

	if (requestToken == null) {
		return res.status(403).json({ message: 'Refresh Token is required!' })
	}

	try {
		let refreshToken = await RefreshToken.findOne({ token: requestToken })

		if (!refreshToken) {
			res.status(403).json({ message: 'Refresh token is not in database!' })
			return
		}

		if (RefreshToken.verifyExpiration(refreshToken)) {
			RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec()

			res.status(403).json({
				message: 'Refresh token was expired. Please make a new signin request',
			})
			return
		}
		let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
			expiresIn: config.jwtExpiration,
		})

		return res.status(200).json({
			accessToken: newAccessToken,
			refreshToken: refreshToken.token,
		})
	} catch (err) {
		return res.status(500).send({ message: err })
	}
}

exports.signout = async (req, res, next) => {
	try {
		req.session = null //jezeli sie logujesz to do req.session przypisujesz token, jezeli sie wylogowujesz to przypisujesz null
		return res.status(200).send({ message: "You've been signed out!" })
	} catch (err) {
		next(err) //??
	}
}
