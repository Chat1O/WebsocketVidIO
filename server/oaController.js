require('dotenv').config();
const STATE = process.env.STATE;

const oaController = {};

//check if state is equal to the state returned from github, if not throw error
oaController.checkState = (req, res, next) => {
  if(req.query.state !== STATE) return next({Log: 'Invalid state', Message: 'Error validating user', Status:417
  })
  else return next();
}

module.exports = oaController;