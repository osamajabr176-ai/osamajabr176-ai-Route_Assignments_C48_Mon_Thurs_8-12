const logsService = require('./logsService');
async function createCappedLogs(req, res, next) {
        try {
        const result = await logsService.createCappedLogs();
        res.status(201).json({ok: 1});
    } catch (error) {
        next(error);
    }

}
async function insertNewlog(req, res, next) {
    try {
        const logData = req.body;
        const result = await logsService.insertNewlog(logData);
        res.status(201).json({ acknowledged: true, insertedId: result.insertedId });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    createCappedLogs,
    insertNewlog
};