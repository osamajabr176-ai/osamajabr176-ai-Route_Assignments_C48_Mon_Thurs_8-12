const db = require('../../common/db/connection');
async function createCappedLogs() {
        const result = await db.db('RouteAssignment6').createCollection('logs', {
            capped: true,
            size: 1048576 // 1MB = 1024 * 1024 bytes
        });
        return result;
}
async function insertNewlog(logData) {
    const insertResult = await db.db('RouteAssignment6').collection('logs').insertOne(logData);
    return insertResult;
}
module.exports = {
    createCappedLogs,
    insertNewlog
};