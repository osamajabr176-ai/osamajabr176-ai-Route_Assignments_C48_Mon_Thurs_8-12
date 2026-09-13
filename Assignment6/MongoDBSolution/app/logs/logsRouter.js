const logsRouter = require('express').Router();
const logsController = require('./logsController');

logsRouter.post('/Createlogs', logsController.createCappedLogs);
logsRouter.post('/Insertlog', logsController.insertNewlog);
module.exports = logsRouter;