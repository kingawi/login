const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../model')
const User = db.user
const Role = db.role
const { TokenExpiredError } = jwt

const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res.status(401).send({ message: 'Unauthorized! Access Token was expired!' })
	}
	return res.status(401).send({ message: 'Unauthorized!' })
}

verifyToken = async (req, res, next) => {
	try {
		let token = req.headers['x-access-token']

		if (!token) {
			return res.status(403).send({ message: 'No token provided!' })
		}

		const decoded = await jwt.verify(token, config.secret)

		req.userId = decoded.id
		next()
	} catch (err) {
		return catchError(err, res)
	}
}

isAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId)
		console.log(user)
		const role = await Role.findOne({
			_id: { $in: user.roles },
		})
		if (role.name == 'admin') {
			next()
		} else {
			res.status(403).send({ message: 'Require Admin Role!' })
		}
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}

isModerator = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId)
		console.log(user)
		const role = await Role.findOne({
			_id: { $in: user.roles },
		})
		if (role.name == 'moderator') {
			next()
		} else {
			res.status(403).send({ message: 'Require Moderator Role!' })
		}
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}

isTrainer = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId)
		console.log(user)
		const role = await Role.findOne({
			_id: { $in: user.roles },
		})
		if (role.name == 'trainer') {
			next()
		} else {
			res.status(403).send({ message: 'Require Trainer Role!' })
		}
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}

const authJwt = {
	verifyToken,
	isAdmin,
	isModerator,
	isTrainer,
}
module.exports = authJwt
