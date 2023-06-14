const express = require('express');
const cors = require('cors');
require('dotenv').config();
const oaRouter = express.Router();
const oaController = require('./oaController') 

//import dotenv variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const STATE = process.env.STATE;

oaRouter.use(cors({credentials: true, origin: true}));

//once oa endpoint hits, redirect to github
oaRouter.use('/', (req, res) => {
  return res.status(200).redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&state=${STATE}`)
});

//after Github accepts client's oauth request, gets redirected back to our app with a temporary code parameter and state
oaRouter.use('/redirect', oaController.checkState, (req, res) => {
  return res.status(200).redirect(`https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`)
});


module.exports = oaRouter;