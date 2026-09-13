const db = require('../../common/db/connection');
async function createAuthor(authorData) {
    
    const insertResult = await db.db('RouteAssignment6').collection('authors').insertOne(authorData);
    return insertResult;
}



module.exports = {
    createAuthor
};
