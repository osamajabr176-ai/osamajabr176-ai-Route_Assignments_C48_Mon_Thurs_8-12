const authorService = require('./authorService');
async function createAuthor(req, res) {
    try {
        const authorData = req.body;
        const result = await authorService.createAuthor(authorData);
        res.status(201).json({ acknowledged: true, insertedId: result.insertedId });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createAuthor,
};