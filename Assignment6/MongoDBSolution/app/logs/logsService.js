const logsRepo = require('./logsRepo');
async function createCappedLogs() {
    const result = await logsRepo.createCappedLogs();
}
async function insertNewlog(logData) {
    const result = await logsRepo.insertNewlog(logData);
    return result;
}
module.exports = {
    createCappedLogs,
    insertNewlog
};