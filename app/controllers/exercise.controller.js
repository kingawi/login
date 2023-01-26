const upload = require('../middlewares/exerciseAdd')
const dbConfig = require('../config/db.config')

const MongoClient = require('mongodb').MongoClient
const GridFSBucket = require('mongodb').GridFSBucket

const url = dbConfig.url

const baseUrl = 'http://localhost:8080/files/'

const mongoClient = new MongoClient(url)

const uploadFiles = async (req, res) => {
	try {
		await upload(req, res)
		console.log(req.file)

		if (req.file == undefined) {
			return res.send({
				message: 'You must select a file.',
			})
		}
		return res.send({
			message: 'File has been uploaded.',
		})
	} catch (error) {
		console.log(error)

		return res.send({
			message: 'Error when trying upload image: ${error}',
		})
	}
}
const getListFiles = async (req, res) => {
	try {
		await connectDb()

		// const database = mongoClient.db(dbConfig.database)
		// const images = database.collection(dbConfig.exercises + '.files')

		const cursor = images.find({})

		if ((await cursor.estimatedDocumentCount()) === 0) {
			return res.status(500).send({
				message: 'No files found!',
			})
		}

		let fileInfos = []
		await cursor.forEach(doc => {
			fileInfos.push({
				name: doc.exerciseName,
				url: baseUrl + doc.exerciseName,
			})
		})

		return res.status(200).send(fileInfos)
	} catch (error) {
		return res.status(500).send({
			message: error.message,
		})
	}
}
//jezeli tu jest polaczenie z baza danych - jak to przeksztalcic zeby laczylo sie z polaczeniem w pliku server.js
const download = async (req, res) => {
	try {
		await connectDb() //czy tutaj nie zrobi sie podwojne polaczenie?

		const database = mongoClient.db(dbConfig.database)
		const bucket = new GridFSBucket(database, {
		bucketName: dbConfig.exercises,
		})

		let downloadStream = bucket.openDownloadStreamByName(req.params.name)

		downloadStream.on('data', function (data) {
			return res.status(200).write(data)
		})

		downloadStream.on('error', function (err) {
			return res.status(404).send({ message: 'Cannot download the Image!' })
		})

		downloadStream.on('end', () => {
			return res.end()
		})
	} catch (error) {
		return res.status(500).send({
			message: error.message,
		})
	}
}
module.exports = {
	uploadFiles,
	getListFiles,
	download,
}

// – For File Upload method, we will export upload() function that:

// use middleware function for file upload
// catch Multer error (in middleware function)
// return response with message
// – For Image File Information and Download:

// getListFiles(): read all files in MongoDB collection photos.files, return list of files’ information (name, url)
// download(): receives file name as input parameter, open download Stream from mongodb built-in GridFSBucket, then response.write(chunk) API to transfer the file to the client.
