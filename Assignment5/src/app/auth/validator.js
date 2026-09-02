const { PrismaClient } = require('@prisma/client');
const validator = require('validator'); // npm install validator

const prismaClient = new PrismaClient();

const prisma = prismaClient.$extends({
  query: {
    user: {
      async create({ args, query }) {
        const { email, password, name } = args.data;

        // Requirement 1: email format validation
        if (!validator.isEmail(email)) {
          throw new Error('Invalid email format');
        }

        // Requirement 2: checkPasswordLength
        checkPasswordLength(password);

        // Requirement 3: checkNameLength (acts as the beforeCreate hook)
        checkNameLength(name);

        return query(args);
      },
    },
    post: {
      // Requirement 1: paranoid/soft-delete — intercept delete
      async delete({ args }) {
        return prismaClient.post.update({
          where: args.where,
          data: { deletedAt: new Date() },
        });
      },
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findUnique({ args, query }) {
        // findUnique can't filter by non-unique field directly;
        // switch soft-deleted lookups to findFirst if you need this filtered too
        return query(args);
      },
    },
  },
});

function checkPasswordLength(password) {
  if (!password || password.length <= 6) {
    throw new Error('checkPasswordLength: password must be greater than 6 characters');
  }
}

function checkNameLength(name) {
  if (!name || name.length <= 2) {
    throw new Error('checkNameLength: name must be greater than 2 characters');
  }
}

module.exports = prisma;