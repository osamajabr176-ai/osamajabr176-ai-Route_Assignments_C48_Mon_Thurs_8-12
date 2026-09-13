const express = require('express');
const app = express();
const db = require('./common/db/connection');
app.use(express.json());

const bookRouter = require('./app/book/bookRouter');
app.use('/books', bookRouter);

const authorRouter = require('./app/author/authorRouter');
app.use('/authors', authorRouter);

const logsRouter = require('./app/logs/logsRouter');
app.use('/logs', logsRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(3000, async () => {
  try {
    await db.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
    console.log('Server is running on port 3000');
});
