const express = require('express');
const { getAllPosts } = require('../db');
const postsRouter = express.Router();
const { requireUser } = require('./utils');

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");

    next();
});

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        posts
    });
});

postsRouter.post('/', requireUser, async (req, res, next) => {
    res.send({ message: 'under construction' });
});

module.exports = postsRouter;