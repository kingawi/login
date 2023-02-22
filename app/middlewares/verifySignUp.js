const db = require('../model')
const ROLES = db.ROLES
const User = db.user

//weryfikacja czy dany uzytkownik/email jest juz w bazie
checkDuplicateUsernameOrEmail = async (req, res, next) => {
	// Username
	try {
		const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })
		if (user) {
			res.status(400).send({
				message:
					user.username === req.body.username
						? 'Przepraszamy, wybrana nazwa użytkownika jest w uzyciu'
						: 'Przepraszamy, wybrany email jest już w użyciu',
			})
		} else {
			next()
		}
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}

checkRolesExisted = async (req, res, next) => {
	try {
		const role = await db.role.findOne({
			name: req.body.roles,
		})
		if (!role) {
			res.status(400).send({
				message: `Failed! Role ${req.body.roles} does not exist!`,
			})
		} else {
			next()
		}
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}
const verifySignUp = {
	checkDuplicateUsernameOrEmail,
	checkRolesExisted,
}

module.exports = verifySignUp
