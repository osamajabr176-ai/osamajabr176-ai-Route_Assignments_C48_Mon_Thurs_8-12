const db = require('../../common/db/connection');

async function createBook(bookData) {
    //part 1 and 5
    await db.db('RouteAssignment6').createCollection('books');
    const insertResult = await db.db('RouteAssignment6').collection('books').insertOne(bookData);
    return insertResult;
}

async function createBookIndex() {
    
        const result = await db.db('RouteAssignment6').collection('books').createIndex({ title: 1 });
    
}

async function createBooks(booksArray) {
    const insertResult = await db.db('RouteAssignment6').collection('books').insertMany(booksArray);
    return insertResult;
}

async function findBookByTitle(title) {
    const book = await db.db('RouteAssignment6').collection('books').findOne({ title: title });
    return book;
}
async function updateAbook(updateData, title) {
    const bookExists = await findBookByTitle(title);
    if (!bookExists) {
        throw new Error(`Book with title "${title}" not found`);
    }
    const updateFields = {updatedAt: new Date(), ...updateData };
    const updateResult = await db.db('RouteAssignment6').collection('books').updateOne(
        { title: title },
        { $set: updateFields }
    );
    return updateResult;
}

async function findBookBetweenDates(startDate, endDate) {
    const books = await db.db('RouteAssignment6').collection('books').find({
        year: { $gte: startDate, $lte: endDate }
    }).toArray();
    return books;
}

async function findByGenre(genre) {
    const books = await db.db('RouteAssignment6').collection('books').find({
        genres: genre
    }).toArray();
    return books;
}
 async function getbooks(skip, limit) {
    const books = await db.db('RouteAssignment6').collection('books').find({
        year: { $exists: true } // Ensure the year field exists
    }, {
        sort: { year: -1 } // Sort by year in descending order
    }).skip(skip).limit(limit).toArray();
    return books;
}

async function findbookswithyearinteger() {
    const books = await db.db('RouteAssignment6').collection('books').find({
        year: { $type: "int" } // Find books with year as an integer
    }).toArray();
    return books;
}

async function allBooksExceptGenres(genre){
    const books =  await db.db('RouteAssignment6').collection('books').find({ genres: { $nin: genre } }).toArray();
    return books
}

async function deleteBooksBeforeYear(year) {
    const result = await db.db('RouteAssignment6').collection('books').deleteMany({
        year: { $lt: year }
    });
    return result;
}

async function aggregateAfter2000Sorted() {
    return db.db('RouteAssignment6').collection('books').aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $sort: { year: -1 } }
    ]).toArray();
}

async function aggregateAfter2000Projected() {
    return db.db('RouteAssignment6').collection('books').aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $project: { _id: 0, title: 1, author: 1, year: 1 } }
    ]).toArray();
}

async function aggregateUnwindGenres() {
    return db.db('RouteAssignment6').collection('books').aggregate([
        { $unwind: '$genres' }
    ]).toArray();
}

async function aggregateJoinLogs() {
    return db.db('RouteAssignment6').collection('books').aggregate([
        {
            $lookup: {
                from: 'logs',
                localField: '_id',
                foreignField: 'book_id',
                as: 'logs'
            }
        }
    ]).toArray();
}

module.exports = {
    createBook,
    createBookIndex,
    createBooks,
    findBookByTitle,
    findBookBetweenDates,
    updateAbook,
    findByGenre,
    getbooks,
    findbookswithyearinteger,
    allBooksExceptGenres,
    deleteBooksBeforeYear,
    aggregateAfter2000Sorted,
    aggregateAfter2000Projected,
    aggregateUnwindGenres,
    aggregateJoinLogs
};

