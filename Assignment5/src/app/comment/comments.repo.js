const prisma = require('../db/prisma.js');
 const commentsRepo = () => {
    return {
    
        createComments: async (commentData) => {
            return prisma.comment.create({ data: commentData });
    },
        updateComments: async (commentId, commentData) => {
            return prisma.comment.update({ where: { id: commentId }, data: commentData });
    },
        findCommentsByPostIduserId: async (postId, userId) => {
            return prisma.comment.findMany({ where: { postId, userId } });
    },
    findCommenstByContent: async (content) => {
        return prisma.comment.findMany({ where: { content } });
    },
    getTheLastThreeNewComments: async (id) => {
        return prisma.comment.findMany({
            where: {  postId: id },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });
    },
    getCommentsById: async (Id) => {   
        return prisma.comment.findMany({
            where: { commentId: Id },
            include: { user: true, post: true },
        });
    
    }
}
};
module.exports = { commentsRepo };