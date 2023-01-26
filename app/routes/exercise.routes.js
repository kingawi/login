const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");
const uploadController = require("../controllers/exercise.controller");

// let exerciseUpload = app => {
//   router.get("/", homeController.getHome);

//   router.post("/upload", uploadController.uploadFiles);
//   router.get("/files", uploadController.getListFiles);
//   router.get("/files/:name", uploadController.download);

//   return app.use("/", router);
// };
// 
// module.exports = exerciseUpload;


module.exports = function (app) {
    app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
		next()
	})
    app.get("/", homeController.getHome);

    app.post("/upload", uploadController.uploadFiles);
    app.get("/files", uploadController.getListFiles);
    app.get("/files/:name", uploadController.download);
  
}

//post
//pobierz wszystkie - get
//update rekordu
//delete 
