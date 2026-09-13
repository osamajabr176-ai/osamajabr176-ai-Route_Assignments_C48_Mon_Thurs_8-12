const bookRepo = require('./bookRepo');
async function createBook(bookData) {
    //part 1 and 5
    
    if (!bookData.title || bookData.title.length === 0) {
        throw new Error('Book title is required');
    }
    
    const insertResult = await bookRepo.createBook(bookData);
    
    return insertResult;
}
async function createBookIndex() {
    const result = await bookRepo.createBookIndex();
    return result;
}
async function createBooksBatch(booksArray) {
    if (!Array.isArray(booksArray) || booksArray.length < 3) {
        throw new Error('At least three book records are required');
    }
    for (const book of booksArray) {
        if (!book.title || book.title.length === 0) {
            throw new Error('Each book requires a title');
        }
    }
    const insertResult = await bookRepo.createBooks(booksArray);
    return insertResult;
}
async function updateBook(updateData, title) {
    if (!title || title.length === 0) {
        throw new Error('Book title is required for update');
    }
    const updateResult = await bookRepo.updateAbook(updateData, title);
    return updateResult;
}
async function findBookByTitle(title) {
    if (!title || title.length === 0) {
        throw new Error('Book title is required for search');
    }
    const book = await bookRepo.findBookByTitle(title);
    if (!book) {
        throw new Error(`Book with title "${title}" not found`);
    }
    return book;
}

async function findBookBetweenDates(startDate, endDate) {
    if (!startDate || !endDate) {
        throw new Error('Both start date and end date are required');
    }
    const books = await bookRepo.findBookBetweenDates(startDate, endDate);
    return books;
}

async function findByGenre(genre) {
    if (!genre || genre.length === 0) {
        throw new Error('Genre is required for search');
    }
    const books = await bookRepo.findByGenre(genre);
    return books;
}

async function getbooks(skip, limit) {
    if (skip < 0 || limit <= 0) {
        throw new Error('Skip must be non-negative and limit must be positive');
    }
    const books = await bookRepo.getbooks(skip, limit);
    return books;
}

async function findbookswithyearinteger() {
    const books = await bookRepo.findbookswithyearinteger();
    return books;
}

async function getBooksExceptGenres(genre) {
    if (!genre || genre.length === 0) {
        throw new Error('Genre is required');
    }
    const books = await bookRepo.allBooksExceptGenres(genre);
    return books;
}

async function deleteBooksBeforeYear(year) {
    const yearNum = Number(year);
    if (!year || isNaN(yearNum)) {
        throw new Error('A valid year is required');
    }
    const result = await bookRepo.deleteBooksBeforeYear(yearNum);
    return result;
}

async function aggregateAfter2000Sorted() {
    return bookRepo.aggregateAfter2000Sorted();
}
async function aggregateAfter2000Projected() {
    return bookRepo.aggregateAfter2000Projected();
}
async function aggregateUnwindGenres() {
    return bookRepo.aggregateUnwindGenres();
}
async function aggregateJoinLogs() {
    return bookRepo.aggregateJoinLogs();
}


module.exports = {
    createBook,
    createBooksBatch,
    createBookIndex,
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
