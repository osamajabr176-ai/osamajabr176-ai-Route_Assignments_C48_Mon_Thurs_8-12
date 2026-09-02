import express from 'express';
const router = express.Router();
import { commentsController } from '../comment/comments.controler.js';
export const commentsRouter = (app) => {
    router.post('/comments', commentsController.createComments);
    router.patch('/comments/:id', commentsController.updateComments);
    router.post('/comments/find-or-create', commentsController.findCommentsByPostIduserId);
    router.get('/comments/search/:content', commentsController.findCommenstByContent);
    router.get('/comments/newest/:postId', commentsController.getTheLastThreeNewComments);
    router.get('/comments/detail/:Id', commentsController.getCommentsById);
}

export default commentsRouter;