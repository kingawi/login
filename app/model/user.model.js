const mongoose = require('mongoose')

const User = mongoose.model(
	'User',
	new mongoose.Schema({
		username: {
			type: String,
			required: true,
			minLength: [4, 'Name should be minimum of 4 characters'],
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minLength: [8, 'Password should be minimum of 8 characters'],
		},
		roles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Role',
			},
		],
		exercises: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Exercise',
			},
		],
	})
)
module.exports = User
