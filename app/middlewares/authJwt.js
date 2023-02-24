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

//do przeanalizowania
verifyToken = async (req, res, next) => {
	let token = req.headers['x-access-token']

	if (!token) {
		return res.status(403).send({ message: 'No token provided!' })
	}
	try {
		const decoded = await jwt.verify(token, config.secret)

		req.userId = decoded.id
		next()
	} catch (err) {
		return catchError(err, res)
	}
}

isAdmin = (req, res, next) => {
	User.findById(req.userId).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err })
			return
		}

		Role.find(
			{
				_id: { $in: user.roles },
			},
			(err, roles) => {
				if (err) {
					res.status(500).send({ message: err })
					return
				}

				for (let i = 0; i < roles.length; i++) {
					if (roles[i].name === 'admin') {
						next()
						return
					}
				}

				res.status(403).send({ message: 'Require Admin Role!' })
				return
			}
		)
	})
}

isModerator = (req, res, next) => {
	User.findById(req.userId).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err })
			return
		}
		Role.find(
			{
				_id: { $in: user.roles },
			},
			(err, roles) => {
				if (err) {
					res.status(500).send({ message: err })
					return
				}

				for (let i = 0; i < roles.length; i++) {
					if (roles[i].name === 'moderator') {
						next()
						return
					}
				}

				res.status(403).send({ message: 'Require Moderator Role!' })
				return
			}
		)
	})
}
isTrainer = async (req, res, next) => {
	try {
		const role = await db.role.findOne({
			name: req.body.roles,
		})
		if (role.name == 'trainer') {
			next()
			return
		} else {
			res.status(403).send({ message: 'Require Trainer Role!' })
			return
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
