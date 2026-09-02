let postRepo = require('../post/post.repo.js');
const prisma = require('../db/prisma.js');
export const postService = () => {
    return {
        createPost: async (postData) => {
            return postRepo.createPost(postData);
        },
        getPostandDetails: async () => {
            return postRepo.getPostandDetails();
        },
        getAllPosts: async () => {
            return postRepo.getAllPosts();
        },
        deletePost: async (postId) => {
            if(!postId || isNaN(postId)) {
                throw new Error('Invalid postId');
            }
            if(!await postRepo.getPostById( postId)) {
                throw new Error('Post not found');
            }
            return postRepo.deletePost(prisma, postId);
        }
    };
};