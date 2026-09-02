import { commentsRepo } from '../comment/comments.repo.js';
export const commentsService = () => {
    return {
        createComments: async (commentData) => {
            let element;
            for (let i = 0; i < 5; i++) {
                element = await commentsRepo.createComments(commentData);
            }
            return element;
        },
        updateComments: async (commentId, commentData) => {
            if (!commentId || isNaN(commentId)) {
                throw new Error('Invalid commentId');
            }
            if (!await commentsRepo.findCommentsByPostIduserId(commentData.postId, commentData.userId)) {
                throw new Error('Comment not found');
            }
            if (commentData.userId !== req.user.id) {
                throw new Error('Unauthorized: You can only update your own comments');
            }
            return commentsRepo.updateComments(commentId, commentData);
        },
        findCommentsByPostIduserId: async (postId, userId) => {
            if (!postId || isNaN(postId)) {
                throw new Error('Invalid postId');
            }
            if (!userId || isNaN(userId)) {
                throw new Error('Invalid userId');
            }
            if (!await commentsRepo.findCommentsByPostIduserId(postId, userId)) {
                return commentsRepo.createComments({ postId, userId, content: "Default comment" });
            }
            return commentsRepo.findCommentsByPostIduserId(postId, userId);
        },
        findCommenstByContent: async (content) => {
            if (!content || typeof content !== 'string') {
                throw new Error('Invalid content');
            }
            const comments = await commentsRepo.findCommenstByContent(content);
            if (comments.length === 0) {
                throw new Error('No comments found with the specified content');
            }
            return comments;
        },
        getTheLastThreeNewComments: async (id) => {
            return commentsRepo.getTheLastThreeNewComments(id);
        },
        getCommentsById: async (Id) => {
            if (!Id || isNaN(Id)) {
                throw new Error('Invalid Id');
            }
            const comments = await commentsRepo.getCommentsById(Id);
            if (comments.length === 0) {
                throw new Error('No comments found with the specified Id');
            }
            return comments;
        }
    };
};