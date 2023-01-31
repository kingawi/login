const express = require('express')
// const router = express.Router();
const homeController = require('../controllers/home.controller')
const uploadController = require('../controllers/exercise.controller')

// let exerciseUpload = app => {
//   router.get("/", homeController.getHome);

//   router.post("/upload", uploadController.uploadFiles);
//   router.get("/files", uploadController.getListFiles);
//   router.get("/files/:name", uploadController.download);

//   return app.use("/", router);
// };
//
// module.exports = exerciseUpload;

// module.exports = function (app) {
//     app.use(function (req, res, next) {
// 		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
// 		next()
// 	})
//     app.get("/", homeController.getHome);

//     app.post("/upload", uploadController.uploadFiles);
//     app.get("/files", uploadController.getListFiles);
//     app.get("/files/:name", uploadController.download);

// }

//post
//pobierz wszystkie - get
//update rekordu
//delete

app.get('/trainerExercises', (req, res) => {
	const trainerExercises = [] //
	if (exercise.user._id == req.body.user._id) {
		let exe = db.exercises.find({ exerciseCreator: req.body.user._id })
		forEach({ exe })
		{
			trainerExercises.push(exercises.user._id)
			console.log(trainerExercises)
		}}
    else {
            res.status(404).send({ message: "Nie znaleziono ćwiczeń dodanych przez trenera" });
            return;
        }
	}
)
app.get("/trainerExercise", async (req, res) => {
    try {
      const trainerExercise = await User.find().populate({
        path: "exercises",
        select: "exerciseName exerciseDescription"
      })
  
      res.status(200).json({ data: exercises });
    } catch (error) {
      res.status(500).json({ error });
    }
  });
	//-jak wrzucic wyswietlone wyniki do tablicy trainerExercises i pozniej to wyswietlic?
	//zrobic petle for i in db.xercise krotsze od exe.length dodaj do tablicy i cgl tablice
	//exec() method executes a search for a match in a specified string and returns a result array, or null

// 	const Exercise = db.exercise
// 	Exercise.find({
// 		exerciseCreator: req.body.exerciseCreator, //czy tu na pewno ma byc req.body? co jak user bedzie chcial wyszukac?
// 	}).exec((err, exercise) => {
// 		//czy tu na pewno ma byc error?co zamiast user?
// 		//exec() method executes a search for a match in a specified string and returns a result array, or null
// 		if (err) {
// 			res.status(400).send({ message: err })
// 			return
// 		}
// 	})
// }))
