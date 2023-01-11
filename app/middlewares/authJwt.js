const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../model')
const User = db.user
const Role = db.role

//do przeanalizowania
verifyToken = (req, res, next) => {
	let token = req.session.token //??

	if (!token) {
		return res.status(403).send({ message: 'No token provided!' })
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: 'Unauthorized!' })
		}
		req.userId = decoded.id
		next()
	})
} //w przypadku wybrania sciezki /api/test/admin(kod w user.routes.js)
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
//w przypadku wybrania sciezki /api/test/mod(kod w user.routes.js)
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
isTrainer = (req, res, next) => {
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
					if (roles[i].name === 'trainer') {
						next()
						return
					}
				}

				res.status(403).send({ message: 'Require Trainer Role!' })
				return
			}
		)
	})
}
const authJwt = {
	verifyToken,
	isAdmin,
	isModerator,
	isTrainer,
}
module.exports = authJwt
