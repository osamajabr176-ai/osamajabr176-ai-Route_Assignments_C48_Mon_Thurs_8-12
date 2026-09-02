const validator = require('../auth/validator');
const userRepo = require('../user/user.repo.js');
const prisma = require('../db/prisma.js');
const userService = {
    createUser: async ( userData) => {
        validator.validateUserCreation(userData);
        return userRepo.createUser(prisma, userData);
    },
    updateUser: async (prisma, userId, updateData) => {
        validator.validateUserUpdate(updateData);
        if (!updateData || Object.keys(updateData).length === 0) {
            userRepo.createUser(prisma, { email: updateData.email, password: updateData.password, name: updateData.name });
        }
        return userRepo.updateUser(prisma, userId, updateData);
    },
    getUserById: async (prisma, userId) => {
        if (!userId) {
            throw new Error('User ID is required');
        }
        validator.validateUserId(userId);
        return userRepo.getUserById(prisma, userId);
    },
    getUserByEmail: async (prisma, email) => {
        if (!email) {
            throw new Error('Email is required');
        }
        validator.validateUserEmail(email);
        return userRepo.getUserByEmail(prisma, email);
    },
};
module.exports = { userService };