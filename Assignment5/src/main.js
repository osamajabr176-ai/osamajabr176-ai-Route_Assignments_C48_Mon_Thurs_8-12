const express = require('express');
const app = express();
const port = 3000;
const commentsRouter = require('./app/comment/comments.router');
const userRouter = require('./app/user/user.router');
const postRouter = require('./app/post/post.router');

app.use(express.json());
app.use('/api', commentsRouter);
app.use('/api', userRouter);
app.use('/api', postRouter);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// seed.js — Prisma seed script
const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();

const users = [
  { name: 'Ahmad Khalil', email: 'ahmad.khalil@example.com', password: '$2b$10$abcdefghijklmnopqrstuv1', role: Role.admin },
  { name: 'Layla Mansour', email: 'layla.mansour@example.com', password: '$2b$10$abcdefghijklmnopqrstuv2', role: Role.user },
  { name: 'Omar Fares', email: 'omar.fares@example.com', password: '$2b$10$abcdefghijklmnopqrstuv3', role: Role.user },
  { name: 'Nour Saad', email: 'nour.saad@example.com', password: '$2b$10$abcdefghijklmnopqrstuv4', role: Role.user },
  { name: 'Sara Haidar', email: 'sara.haidar@example.com', password: '$2b$10$abcdefghijklmnopqrstuv5', role: Role.user },
  { name: 'Karim Aoun', email: 'karim.aoun@example.com', password: '$2b$10$abcdefghijklmnopqrstuv6', role: Role.user },
];

const posts = [
  { title: 'Getting Started with Prisma', content: 'Prisma makes database access type-safe and productive. In this post we cover setting up your first schema, running migrations, and querying data efficiently.', userIdx: 0 },
  { title: 'Understanding Relational Databases', content: 'Relational databases organize data into tables linked by foreign keys. We explore normalization, indexing, and common pitfalls when designing schemas.', userIdx: 1 },
  { title: 'Node.js Performance Tips', content: 'Event loop behavior, async patterns, and profiling tools that help you find bottlenecks in a Node.js backend before they become production incidents.', userIdx: 2 },
  { title: 'REST vs GraphQL', content: 'A practical comparison of REST and GraphQL APIs, covering caching, over-fetching, tooling maturity, and when each approach fits better.', userIdx: 0 },
  { title: 'Docker for Local Development', content: 'Containerizing your development environment removes "works on my machine" issues. We walk through a docker-compose setup for a Node + Postgres stack.', userIdx: 3 },
  { title: 'Testing Strategies for APIs', content: 'Unit tests, integration tests, and contract tests each serve a different purpose. Here is how to combine them without duplicating effort.', userIdx: 4 },
  { title: 'CI/CD Pipelines Explained', content: 'From commit to production: linting, testing, building, and deploying automatically. A breakdown of a typical GitHub Actions pipeline.', userIdx: 5 },
  { title: 'Database Indexing Basics', content: 'Indexes speed up reads but slow down writes. Understanding B-tree indexes and when to add (or avoid) them is essential for scaling.', userIdx: 1 },
];

const comments = [
  { content: 'This helped me set up my project in under an hour, thanks!', postIdx: 0, userIdx: 1 },
  { content: 'Could you cover migrations in more depth in a follow-up?', postIdx: 0, userIdx: 2 },
  { content: 'Normalization section was clear, finally understood 3NF.', postIdx: 1, userIdx: 0 },
  { content: 'I disagree slightly — sometimes denormalizing is the right call for read-heavy apps.', postIdx: 1, userIdx: 3 },
  { content: 'The profiling tools section saved me hours of debugging.', postIdx: 2, userIdx: 4 },
  { content: 'Would love a comparison with Bun as well.', postIdx: 2, userIdx: 5 },
  { content: 'GraphQL over-fetching point is underrated, good callout.', postIdx: 3, userIdx: 2 },
  { content: 'REST is still simpler for small teams honestly.', postIdx: 3, userIdx: 1 },
  { content: 'docker-compose file example would be a great addition.', postIdx: 4, userIdx: 5 },
  { content: 'This fixed my "works on my machine" headache.', postIdx: 4, userIdx: 0 },
  { content: 'Contract testing is something we skipped, going to try it now.', postIdx: 5, userIdx: 3 },
  { content: 'Solid breakdown of the CI/CD stages.', postIdx: 6, userIdx: 4 },
  { content: 'Indexing basics explained without the usual jargon overload.', postIdx: 7, userIdx: 5 },
  { content: 'Do you have benchmarks showing the write penalty?', postIdx: 7, userIdx: 2 },
];

async function main() {
  const createdUsers = [];
  for (const u of users) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
  }

  const createdPosts = [];
  for (const p of posts) {
    const post = await prisma.post.create({
      data: {
        title: p.title,
        content: p.content,
        userId: createdUsers[p.userIdx].id,
      },
    });
    createdPosts.push(post);
  }

  for (const c of comments) {
    await prisma.comment.create({
      data: {
        content: c.content,
        postId: createdPosts[c.postIdx].id,
        userId: createdUsers[c.userIdx].id,
      },
    });
  }

  console.log(`Seeded ${createdUsers.length} users, ${createdPosts.length} posts, ${comments.length} comments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });