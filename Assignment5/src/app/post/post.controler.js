const postService = require('../post/post.service.js');
export const postController = () => {
    return {
        createPost: async (req, res) => {
            try {
                const postData = req.body;
                const createdPost = await postService.createPost(postData);
                res.status(201).json(createdPost, { message: "Post created successfully" });
            } catch (error) {
                res.status(500).json({ message: "Failed to create post" });
            }
        },
        getPostandDetails: async (req, res) => {
            try {
                
                const postDetails = await postService.getPostandDetails();
                res.json(postDetails);
            } catch (error) {
                res.status(500).json({ message: "Failed to retrieve post details" });
            }
        },
        getAllPosts: async (req, res) => {
            try {
                const posts = await postService.getAllPosts();
                res.json(posts, { message: "Posts retrieved successfully" });
            } catch (error) {
                res.status(500).json({ message: "Failed to retrieve posts" });
            }
        },
        deletePost: async (req, res) => {
            try {
                const postId = parseInt(req.params.id);
                const deletedPost = await postService.deletePost(postId);
                res.json(deletedPost, { message: "Post deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Failed to delete post" });
            }
        }
    };
}