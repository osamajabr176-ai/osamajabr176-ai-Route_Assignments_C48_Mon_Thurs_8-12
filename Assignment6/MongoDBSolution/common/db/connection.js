const path = require('path');
const {MongoClient} = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '../../app/.env') });
const db = new MongoClient(process.env.MONGO_URI);

module.exports = db;