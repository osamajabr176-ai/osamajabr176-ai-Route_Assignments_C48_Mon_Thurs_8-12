const fs = require('node:fs');
const path = require('node:path');
/* ==========  PART 1  ========== */

// 1 : 

function pathFinder() {
    console.log(__dirname);
}
pathFinder();

// 2 :
console.log('--------------------');
function fileNameFinder(str) {
    let separator = path.sep;
    const filePath = str.split(separator);
    return filePath[filePath.length - 1];
}
console.log(fileNameFinder('C:\\Users\\OSAMA\\Documents\\Learn\\Nodejs\\Route\\Assignments\\Assignment2'));

// 3 :

console.log('--------------------');
function pathBuilder(obj) {

    let path = '';
    let separator = '\\';
    for (let key in obj) {
        path += obj[key] + separator;
    }
    return path.slice(0, -1);
}

console.log(pathBuilder({ a: 'C:', b: 'Users', c: 'OSAMA', d: 'Documents', e: 'Learn', f: 'Nodejs', g: 'Route', h: 'Assignments', i: 'Assignment2' }));

// 4 :

console.log('--------------------');

function getExtension(str) {
    let separator = '.';
    const fileExt = fileNameFinder(str).split('.');
    return fileExt[fileExt.length - 1];
}
console.log(getExtension('C:\\Users\\OSAMA\\Documents\\Learn\\Nodejs\\Route\\Assignments\\Assignment2\\index.js'));

// 5 :

console.log('--------------------');

function fileInfo(str) {
    let fileObj = {};
    fileObj.name = fileNameFinder(str).split('.')[0];
    fileObj.extension = getExtension(str);
    return fileObj;
}
console.log(fileInfo('C:\\Users\\OSAMA\\Documents\\Learn\\Nodejs\\Route\\Assignments\\Assignment2\\index.js'));

// 6 :

console.log('--------------------');

function checkAbsolute(str) {
    if (path.isAbsolute(str)) {
        return true;
    }
    return false;
}
console.log(checkAbsolute('C:\\Users\\OSAMA\\Documents\\Learn\\Nodejs\\Route\\Assignments\\Assignment2\\index.js'));

// 7 :

console.log('--------------------');

function generatePath(Arr) {

    let path = '';
    let separator = '\\';
    for (let i = 0; i < Arr.length; i++) {
        path += Arr[i] + separator;
    }
    return path.slice(0, -1);
}
console.log(generatePath(['C:', 'Users', 'OSAMA', 'Documents', 'Learn', 'Nodejs', 'Route', 'Assignments', 'Assignment2']));

// 8 :

console.log('--------------------');
function resolvePath(str1, str2) {
    return path.resolve(str1, str2);
}
console.log(resolvePath('C:\\Users\\OSAMA\\Documents\\Learn\\Nodejs\\Route\\Assignments\\Assignment2', 'index.js'));

// 9 :

console.log('--------------------');

function joinPath(...str){
    return path.join(...str);
}
console.log(joinPath('C:\\Users\\OSAMA\\Documents\\Learn\\Nodejs\\Route\\Assignments\\Assignment2', 'index.js'));

// 10 :

console.log('--------------------');

function deleteFile(str) {
    fs.unlink(str, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File deleted successfully');
    });}

    // 11 :

function createAfolder(str) {
    fs.mkdir(str, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Success');
        
    });
}
createAfolder('C:\\Users\\OSAMA\\Documents\\Learn\\Nodejs\\Route\\Assignments\\Assignment2\\NewFolder');

// 12 :

const {EventEmitter} = require('node:events');
const emitter = new EventEmitter();
emitter.on('start', (name) => {
    console.log(`Welcome, ${name}!`);
});
emitter.emit('start', 'Dr.Manar');

// 13 :

const logInemitter = new EventEmitter();
logInemitter.on('login', (username) => {
    console.log(`User logged in: ${username}`);
});
logInemitter.emit('login', 'Dr.Manar');

// 14 :

fs.readFileSync('Osama.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
})

// 15 :

fs.writeFileSync('Osama.txt', 'Hello, World!', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('File written successfully');
});

// 16 :

function dirExists(str) {
    return fs.existsSync(str);
}

// 17 :

const os = require('node:os');

function osInfo() {
    return {
        platform: os.platform(),
        architecture: os.arch(),    
    }
}
osInfo();

// 18 : 

const stream = fs.createReadStream('Osama.txt', 'utf8');
stream.on('data', (chunk) => {
    console.log(chunk);
});

stream.on('end', () => {
    console.log('Finished reading file');
});

// 19 :

function writeToFile(src,dest) {
    const readStream = fs.createReadStream(src, 'utf8');
    const writeStream = fs.createWriteStream(dest, { flags: 'a' });
    readStream.pipe(writeStream);
    writeStream.on('finish', () => {
        console.log('File copied using stream');
    });
}

// 20 :

const zlib = require("zlib");

function compressFile(inputFile, outputFile) {
    const readStream = fs.createReadStream(inputFile);
    const writeStream = fs.createWriteStream(outputFile);
    const gzip = zlib.createGzip();

    readStream
        .pipe(gzip)
        .pipe(writeStream)
        .on("finish", () => {
            console.log(`${inputFile} has been compressed to ${outputFile}`);
        })
        .on("error", (err) => {
            console.error("Error:", err.message);
        });
}

compressFile("Osama.txt", "file.txt.gz");

/* ==========  PART 2  ========== */

const http = require('node:http');
const users = require('./users.json');
const server = http.createServer((req, res) => {
    
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Welcome to the Home Page');
    }

    else if (req.url === '/users' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }

    else if (req.url === '/users' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const userData = JSON.parse(body);

        for (let i = 0; i < users.length; i++) {
            if (users[i].email === userData.email) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                return res.end(JSON.stringify({
                    error: 'User already exists'
                }));
            }
        }

        users.push(userData);
        fs.writeFileSync('./users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
                return res.end(JSON.stringify({
                    error: 'Failed to write to file'
                }));
            }
        });

        res.writeHead(201, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(userData));
    });
}
    else if (req.url.startsWith('/users/') && req.method === 'PATCH') {
        let body = '';
        const id = Number(req.url.split('/')[2]);
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        
        req.on('end', () => {

            if (!body) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No data provided' }));
            return;
            }
            const userData = JSON.parse(body);
            const userIndex = users.findIndex((u) => u.id === userData.id);
            if (userIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
            }
            users[userIndex] = { ...users[userIndex], ...userData };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users[userIndex]));
            fs.writeFileSync('./users.json', JSON.stringify(users, null, 2), (err) => {
                 if (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
                return res.end(JSON.stringify({
                    error: 'Failed to write to file'
                }));
            }
        });
    });
    }
    else if (req.url.startsWith('/users/') && req.method === 'DELETE') {

    const id = Number(req.url.split('/')[2]);

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            error: 'User not found'
        }));
    }

    users.splice(userIndex, 1);

    fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'User deleted successfully'
        }));
    }

else if (req.url.startsWith('/users/') && req.method === 'GET') {
        const id = Number(req.url.split('/')[2]);
        const user = users.find(u => u.id === id);
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'User not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    }
});
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

