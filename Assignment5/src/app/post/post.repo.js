const prisma = require('../db/prisma.js');
const postRepo = {
    createPost: async (postData) => {
        return prisma.post.create({ data: postData });
    },
    deletePost: async (postId) => {
        return prisma.post.delete({ where: { id: postId } });
    },
    getPostandDetails: async (postId) => {
        return prisma.post.findUnique({  include: { user:{ select: { id: true, name: true } } ,comments: {select: { id: true, content: true } } 
        }});
    },
    getAllPosts: async () => {
        return prisma.post.findMany();
    },
};
module.exports = { postRepo };