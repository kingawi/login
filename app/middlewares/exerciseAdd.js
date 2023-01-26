const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db.config");
// – We define a storage configuration object with GridFsStorage class.
const storage = new GridFsStorage({
    // url: must be a standard MongoDB connection string pointing to the MongoDB database. multer-gridfs-storage module will create a mongodb connection for you automatically.
  url: dbConfig.url + dbConfig.DB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["txt"];

    if (match.indexOf(file.mimetype) === -1) {
      const exerciseName = `${Date.now()}-kinia_db-${file.originalname}`; //zrobic update zeby dodawalo nazwe uzytkownika
      return exerciseName;
    }

    return {
      bucketName: dbConfig.exercises,
      exerciseName: `${Date.now()}-kinia_db-${file.originalname}`
    };
  }
});
// – Next we use multer module to initialize middleware and util.promisify() to make the exported middleware object can be used with async-await.
const uploadFiles = multer({ storage: storage }).single("file");
const exerciseAdd = util.promisify(uploadFiles);
module.exports = exerciseAdd;




// options: customizes how to establish the connection, specified in the MongoClient.connect documentation.
// file: this is the function to control the file storage in the database. The return value of this function is an object with the properties such as: filename, metadata, chunkSize, bucketName, contentType… We also check if the file is an image or not using file.mimetype. Then we add the [timestamp]-bezkoder- prefix to the file’s original name to make sure that the duplicates never occur in MongoDB collection. bucketName indicates that the file will be stored at photos.chunks and photos.files collections.


