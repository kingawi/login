const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dbConfig = require('./app/config/db.config')
const app = express()

var corsOptions = {
	origin: 'http://localhost:8081',
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require('./app/model')
const Role = db.role
async function connectDb() {
	try {
		db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log('Successfully connect to MongoDB.')
		initial()
	} catch (err) {
		console.error('Connection error', err)
		process.exit()
	}
}
connectDb()

app.get('/', (req, res) => {
	res.json({ message: 'Welcome to Kinia application.' })
})

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/exercise.routes')(app)


const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`)
})

function initial() {
	Role.estimatedDocumentCount((err, count) => {
		if (!err && count === 0) {
			new Role({
				name: 'user',
			}).save(err => {
				if (err) {
					console.log('error', err)
				}
				console.log("added 'user' to roles collection")
			})

			new Role({
				name: 'moderator',
			}).save(err => {
				if (err) {
					console.log('error', err)
				}
				console.log("added 'moderator' to roles collection")
			})
			new Role({
				name: 'admin',
			}).save(err => {
				if (err) {
					console.log('error', err)
				}
				console.log("added 'admin' to roles collection")
			})
			new Role({
				name: 'trainer',
			}).save(err => {
				if (err) {
					console.log('error', err)
				}
				console.log("added 'trainer' to roles collection")
			})
		}
	})
}
