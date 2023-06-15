require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const STATE = process.env.STATE;

const oaController = {};

//check if state is equal to the state returned from github, if not throw error
oaController.checkState = (req, res, next) => {
  if(req.query.state !== STATE) return next({Log: 'Invalid state', Message: 'Error validating user', Status:417
  })
  else return next();
}

//functionality to get the access token from github
oaController.accessToken = (req, res, next) => {
  try {
    const {code} = req.query;
    //send a post request to github
    const requestToken = async() => {
      const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&CODE=${code}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      res.locals.token = response;
    }
    return next();
  } catch(err) {
    return next({Log: 'Error receiving token', Message: 'Github token error occured', Status:401})
  }
}

//use token to access API
oaController.accessAPI = (req, res, next) => {
  try {
    const ghAPI = async() => {
      const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${res.locals.token}`
        }
      })
    } 
    return next();
  } catch (error) {
    return next({Log: 'Error in accessAPI middleware function', Message: 'Error accessing Github API', Status: 401})
  }
}

module.exports = oaController;