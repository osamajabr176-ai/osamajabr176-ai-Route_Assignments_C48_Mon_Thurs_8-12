import {userService} from '../user/user.service.js';
export const userController = {
    createUser: async (req, res) => {
        try {
            const userData = req.body;
            const newUser = await userService.createUser(req.prisma, userData);
            res.status(201).json(newUser,{ message: "User created successfully" });
        } catch (error) {
            res.status(400).json({ message: "Email already exists" });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedUser = await userService.updateUser(req.prisma, id, updateData);
            res.json(updatedUser, { message: "User created or updated successfully" });
        } catch (error) {
            res.status(400).json({ message: "Failed to update user" });
        }
    },
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(req.prisma, id);
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: "no user found" });
        }
    },
    getUserByEmail: async (req, res) => {
        try {
            const { email } = req.params;
            const user = await userService.getUserByEmail(req.prisma, email);
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: "no user found" });
        }
    },
}