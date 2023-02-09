const db = require('../model')
const ROLES = db.ROLES
const User = db.user

//weryfikacja czy dany uzytkownik/email jest juz w bazie
checkDuplicateUsernameOrEmail = async (req, res) => {
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
		}
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}

checkRolesExisted = (req, res, next) => {
	if (req.body.roles) {
		for (let i = 0; i < req.body.roles.length; i++) {
			if (!ROLES.includes(req.body.roles[i])) {
				res.status(400).send({
					message: `Failed! Role ${req.body.roles[i]} does not exist!`,
				})
				return
			}
		}
	}
	next()
}
const verifySignUp = {
	checkDuplicateUsernameOrEmail,
	checkRolesExisted,
}

module.exports = verifySignUp
