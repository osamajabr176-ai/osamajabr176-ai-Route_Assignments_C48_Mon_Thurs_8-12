const authorRepo = require('./authorRepo');
async function createAuthor(authorData) {
        if (!authorData.name || authorData.name.length === 0) {
        throw new Error('Author name is required');
    }
    if (!authorData.nationality || authorData.nationality.length === 0) {
        throw new Error('Author nationality is required');
    }
    const insertResult = await authorRepo.createAuthor(authorData);
    return insertResult;
}

module.exports = {
    createAuthor,
};
