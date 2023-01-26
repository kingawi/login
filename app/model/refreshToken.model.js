const mongoose = require('mongoose')
const config = require('../config/auth.config')
const { v4: uuidv4 } = require('uuid')

const RefreshTokenSchema = new mongoose.Schema({
	token: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', 
	},
	expiryDate: Date,
})
//createToken: use uuid library for creating a random token and save new object into MongoDB database
RefreshTokenSchema.statics.createToken = async function (user) {
	let expiredAt = new Date()

	expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration)

	let _token = uuidv4()

	let _object = new this({
		token: _token,
		user: user._id,
		expiryDate: expiredAt.getTime(),
	})

	console.log(_object)

	let refreshToken = await _object.save()

	return refreshToken.token
}
//verifyExpiration: compare expiryDate with current Date time to check the expiration
RefreshTokenSchema.statics.verifyExpiration = token => {
	return token.expiryDate.getTime() < new Date().getTime()
}

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema)

module.exports = RefreshToken
