const db = require("../model");
const ROLES = db.ROLES;
const User = db.user;

//weryfikacja czy dany uzytkownik/email jest juz w bazie
checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username 
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    //exec() method executes a search for a match in a specified string and returns a result array, or null
    if (err) { //500 - internal server error
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Przepraszamy, wybrana nazwa użytkownika jest już zajęta" });
      return;
    }
// Email
User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Przepraszamy, wybrany email jest już w użyciu" });
      return;
    }

    next();
  });
});
}
//czym jest next
//“next” is used to call other “middle-ware” functions with Express which can handle other things such as logging or error handling.
checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: `Failed! Role ${req.body.roles[i]} does not exist!`
          });
          return;
        }
      }
    }
  
    next();
  };
  const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
  };
  
  module.exports = verifySignUp;
  