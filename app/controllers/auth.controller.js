const config = require('../config/auth.config')
const db = require('../model')
const { user: User, role: Role, refreshToken: RefreshToken } = db

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.signup = async (req, res) => {
	try {
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 8),
		})

		if (req.body.roles) {
			const rolles = await Role.find({
				name: { $in: req.body.roles },
			})((user.roles = rolles.map(role => role._id)))
			await user.save()
			res.send({ message: `User ${req.body.username} was registered successfully!` })
		} else {
			Role.findOne(
				{ name: 'user' },
				(user.roles = [role._id]),
				user.save(),
				res.send({ message: 'User was registered successfully!' })
			)
		}
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}

exports.signin = async (req, res) => {
	try {
		const userr = await User.findOne({
			username: req.body.username,
		})
		userr.populate('roles', '-__v')
		console.log(userr, 'user')
		if (!userr) {
			return res.status(404).send({ message: 'User Not found.' })
		}
		let passwordIsValid = bcrypt.compareSync(req.body.password, userr.password)

		if (!passwordIsValid) {
			return res.status(401).send({
				accessToken: null,
				message: 'Invalid Password!',
			})
		}
		let token = jwt.sign({ id: userr.id }, config.secret, {
			expiresIn: config.jwtExpiration,
		})
		let refreshToken = await RefreshToken.createToken(userr)
		let authorities = []

		for (let i = 0; i < userr.roles.length; i++) {
			authorities.push('ROLE_' + userr.roles[i].name.toUpperCase())
		}
		res.status(200).send({
			id: userr._id,
			username: userr.username,
			email: userr.email,
			roles: authorities,
			accessToken: token,
			refreshToken: refreshToken,
		})
	} catch (err) {
		{
			res.status(500).send({ message: err })
			return
		}
	}
}
exports.refreshToken = async (req, res) => {
	try {
		const { refreshToken: requestToken } = req.body

		if (requestToken == null) {
			return res.status(403).json({ message: 'Refresh Token is required!' })
		}

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
		req.session = null
		return res.status(200).send({ message: "You've been signed out!" })
	} catch (err) {
		next(err)
	}
}
