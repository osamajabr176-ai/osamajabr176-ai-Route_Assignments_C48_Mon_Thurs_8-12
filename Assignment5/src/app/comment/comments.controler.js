import { commentsService } from '../comment/comments.service.js';
export const commentsController = () => {
    const commentsServiceInstance = commentsService(); 
    return {
        createComments: async (req, res) => {
            try {
                const commentData = req.body;
                const createdComment = await commentsServiceInstance.createComments(commentData);
                res.status(201).json(createdComment);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        },
        updateComments: async (req, res) => {
            try {
                const commentId = parseInt(req.params.id);
                const commentData = req.body;
                const updatedComment = await commentsServiceInstance.updateComments(commentId, commentData);
                res.json(updatedComment);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        },
        findCommentsByPostIduserId: async (req, res) => {
            try {
                const { postId, userId } = req.params;
                const comments = await commentsServiceInstance.findCommentsByPostIduserId(parseInt(postId), parseInt(userId));
                res.json(comments);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        },
        findCommenstByContent: async (req, res) => {
            try {
                const { content } = req.params;
                const comments = await commentsServiceInstance.findCommenstByContent(content);
                res.json(comments);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        },
        getTheLastThreeNewComments: async (req, res) => {
            try {
                const {postId} = req.params;
                const comments = await commentsServiceInstance.getTheLastThreeNewComments(parseInt(postId));
                res.json(comments);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        },
        getCommentsById: async (req, res) => {
            try {
                const { Id } = req.params;
                const comments = await commentsServiceInstance.getCommentsById(parseInt(Id));
                res.json(comments);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }
    };
};