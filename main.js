/* ========= PART 1 ======== */
// 1 :

// Node.js is a single-threaded, non-blocking, asynchronous, and event-driven runtime environment. 
// It uses an event loop to handle multiple requests concurrently without creating multiple threads. 
// The event loop allows Node.js to perform non-blocking I/O operations, even though JavaScript is single-threaded.

// 2 :

//Libuv is a multi-platform support library that provides asynchronous I/O capabilities for Node.js.
// It is written in C and is responsible for handling the event loop, file system operations, networking, and other low-level tasks in Node.js.

// 3 :

// Node.js uses the event loop and libuv to handle asynchronous operations. 
// When an asynchronous operation is initiated, Node.js registers a callback function and continues executing other code. 
// Once the operation is complete, the callback is added to the event loop's queue, and when the event loop is ready, it executes the callback, allowing for non-blocking I/O operations.

// 4 :

// The Call Stack is a data structure that keeps track of the active function calls in the program. 
// The Event Queue is a queue that holds the callback functions that are waiting to be executed.
// The Event Loop is a mechanism that continuously checks the Call Stack and the Event Queue. 
// If the Call Stack is empty, it takes the first callback from the Event Queue and pushes it onto the Call Stack for execution. 
// This process allows Node.js to handle asynchronous operations efficiently.

// 5 :

// The Node.js Thread Pool is a pool of worker threads that are used to execute CPU-intensive tasks asynchronously. 
// The size of the thread pool can be set using the process.env.UV_THREADPOOL_SIZE environment variable or by calling the uv_threadpool_size() function in libuv.

// 6 :

// Node.js handles blocking and non-blocking code execution through its single-threaded, event-driven architecture. 

/* ======== PART 2 ======== */

const fs = require('fs');
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// 1:
app.post('/user', (req, res) => {

    const data = fs.readFileSync('users.json', 'utf-8');

    const users = JSON.parse(data);

    const emailExists = users.some(user => user.email === req.body.email);

    if (emailExists) {
        return res.status(400).json({
            message: 'Email already exists'
        });
    }

    const newUserId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    req.body.id = newUserId;
    users.push(req.body);

    fs.writeFileSync(
        'users.json',
        JSON.stringify(users, null, 2),
        'utf-8'
    );

    res.status(201).json({
        message: 'User created successfully'
    });
});

// 2:

app.patch('/user/:id', (req, res) => {

    const data = fs.readFileSync('users.json', 'utf-8');
    const users = JSON.parse(data);

    const userId = parseInt(req.params.id);

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({
            message: 'User id not found'
        });
    }

    Object.assign(users[userIndex], req.body);

    fs.writeFileSync(
        'users.json',
        JSON.stringify(users, null, 2),
        'utf-8'
    );

    res.status(200).json({
        message: 'User updated successfully'
    });
});

// 3:

app.delete('/user/:id', (req, res) => {

    const data = fs.readFileSync('users.json', 'utf-8');
    const users = JSON.parse(data);

    const userId = parseInt(req.params.id);

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({
            message: 'User id not found'
        });
    }

    users.splice(userIndex, 1);

    fs.writeFileSync(
        'users.json',
        JSON.stringify(users, null, 2),
        'utf-8'
    );

    res.status(200).json({
        message: 'User deleted successfully'
    });
});

// 4:

app.get('/user/getUserByName/:name', (req, res) => {
    const data = fs.readFileSync('users.json', 'utf-8');
    const users = JSON.parse(data);

    const user = users.find(user => user.name === req.params.name);

    if (!user) {
        return res.status(404).json({
            message: 'User name not found'
        });
    }

    res.status(200).json(user);
});

// 5:

app.get('/user', (req, res) => {
    const data = fs.readFileSync('users.json', 'utf-8');
    const users = JSON.parse(data);
    res.status(200).json(users);
});

// 6:

app.get('/user/minAge/:age', (req, res) => {
    const data = fs.readFileSync('users.json', 'utf-8');
    const users = JSON.parse(data);

    const minAge = parseInt(req.params.age);
    const filteredUsers = users.filter(user => user.age >= minAge);

    res.status(200).json(filteredUsers);
});

// 7:

app.get('/user/:id', (req, res) => {
    const data = fs.readFileSync('users.json', 'utf-8');
    const users = JSON.parse(data);

    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({
            message: 'User id not found'
        });
    }

    res.status(200).json(user);
});
