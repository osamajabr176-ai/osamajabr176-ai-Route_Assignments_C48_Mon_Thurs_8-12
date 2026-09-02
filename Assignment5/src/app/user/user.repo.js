const prisma = require('../db/prisma.js');
const userRepo = {
    createUser: async ( userData) => {
        const { email, password, name } = userData;
        
        return prisma.user.create({ data: { email, password, name } });
    },
    updateUser: async ( userId, updateData) => {
        return prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
    },
    getUserById: async (userId) => {
        return prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
    },
    getUserByEmail: async (email) => {
        return prisma.user.findUnique({ where: { email, deletedAt: null } });
    },
};
module.exports = { userRepo };