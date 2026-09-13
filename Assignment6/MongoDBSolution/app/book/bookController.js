const bookService = require('./bookService');
async function createBooks(req,res,next) {
    //part 1 and 5
    try {
        const bookData = req.body;
        const result = await bookService.createBook(bookData);
        res.status(201).json({ ok: 1, acknowledged: true, insertedId: result.insertedId });
    } catch (error) {
        next(error);
    }
}
async function createBookIndex(req, res, next) {
    try {
        const result = await bookService.createBookIndex();
        res.status(201).json({ message: 'Index created on title field', indexName: result });
    } catch (error) {
        next(error);
    }
}
async function createBooksBatch(req, res, next) {
    try {
        const booksArray = req.body;
        const result = await bookService.createBooksBatch(booksArray);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}
async function updateBook(req, res, next) { 
    try {
        const title = req.params.title;
        const updateData = req.body;
        const result = await bookService.updateBook(updateData, title);
        res.status(200).json({ ok: 1, modifiedCount: result.modifiedCount, matchedCount: result.matchedCount });
    } catch (error) {
        next(error);
    }
}
async function findBookByTitle(req, res, next) {
    try {
        const title = req.params.title;
        const book = await bookService.findBookByTitle(title);
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
}
async function findBookBetweenDates(req, res, next) {
    try {
        let { startDate, endDate } = req.query;
        startDate = Number(startDate);
        endDate = Number(endDate);
        const books = await bookService.findBookBetweenDates(startDate, endDate);
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
}
async function findByGenre(req, res, next) {
    try {
        const genre = req.params.genre;
        const books = await bookService.findByGenre(genre);
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
}
async function getbooks(req, res, next) {
    try {
        const { skip, limit } = req.query;
        const books = await bookService.getbooks(Number(skip), Number(limit));
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
}

async function findbookswithyearinteger(req, res, next) {
    try {
        const books = await bookService.findbookswithyearinteger();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }

}

async function getBooksExceptGenres(req, res, next) {
    try {
        const genre = req.query.genre;
        const books = await bookService.getBooksExceptGenres(genre);
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
}

async function deleteBooksBeforeYear(req, res, next) {
    try {
        const year = req.query.year;
        const result = await bookService.deleteBooksBeforeYear(year);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

async function aggregateAfter2000Sorted(req, res, next) {
    try {
        const result = await bookService.aggregateAfter2000Sorted();
        res.status(200).json(result);
    } catch (error) { next(error); }
}
async function aggregateAfter2000Projected(req, res, next) {
    try {
        const result = await bookService.aggregateAfter2000Projected();
        res.status(200).json(result);
    } catch (error) { next(error); }
}
async function aggregateUnwindGenres(req, res, next) {
    try {
        const result = await bookService.aggregateUnwindGenres();
        res.status(200).json(result);
    } catch (error) { next(error); }
}
async function aggregateJoinLogs(req, res, next) {
    try {
        const result = await bookService.aggregateJoinLogs();
        res.status(200).json(result);
    } catch (error) { next(error); }
}

module.exports = {
    createBooks,
    createBookIndex,
    createBooksBatch,
    updateBook,
    findBookByTitle,
    findBookBetweenDates,
    findByGenre,
    getbooks,
    findbookswithyearinteger,
    getBooksExceptGenres,
    deleteBooksBeforeYear,
    aggregateAfter2000Sorted,
    aggregateAfter2000Projected,
    aggregateUnwindGenres,
    aggregateJoinLogs
};
