const authorController = require('./authorController');
const authorRouter = require('express').Router();
authorRouter.post('/', authorController.createAuthor);

module.exports = authorRouter;