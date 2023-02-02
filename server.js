const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieSession = require('cookie-session')
const dbConfig = require('./app/config/db.config')
const app = express()
// const exerciseRoutes = require('./routes/exercise.routes')

var corsOptions = {
	origin: 'http://localhost:8081',
}

app.use(cors(corsOptions))

app.use(express.json())

//Analizuje przychodzące żądania za pomocą ładunków zakodowanych w adresie URL i jest oparty na parserze treści.
app.use(express.urlencoded({ extended: true }))
const db = require('./app/model')
const Role = db.role //pobiera tablice z rolami z db a nastepnie sa one przyporzadkowane do tworzenia obiektow niżej (tworzy kolekcję ról w bazach danych jako obiekt (funkcja initial()))
//przechowywanie danych sesji za pomoca ciasteczek
//polaczenie z baza danych
async function connectDb() {
	try {
		await db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log('Successfully connect to MongoDB.')
		await initial()
	} catch {
		console.error('Connection error', err)
		process.exit()
	}
}
connectDb()
// simple route - jezeli wejdziemy na strone glowna umieszczona w porcie 8080 to otrzymamy wiadomość w formacie json
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to Kinia application.' })
})
// routes
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/exercise.routes')(app)
// ustawienie portu 8080
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
