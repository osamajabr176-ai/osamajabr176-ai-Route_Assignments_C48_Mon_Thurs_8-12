const express = require('express');
const router = express.Router();
const postController = require('../post/post.controler.js'); 
export const postRouter = (app ) => {
    app.use('/posts', router);
    router.post('/', postController.createPost);
    router.get('/details', postController.getPostandDetails);
    router.get('/', postController.getAllPosts);
    router.delete('/:id', postController.deletePost);
}
