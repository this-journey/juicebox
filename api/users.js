const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getAllUsers, getUserByUsername, createUser } = require('../db');

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");

    next();
});

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();

    res.send({
        users
    });
});

usersRouter.post('/login', async (req, res, next) => {
    console.log({body:req.body});
const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password."
        });
    }

    try {
        const user = await getUserByUsername(username);
        console.log(user);

        if (user && user.password == password) {
            const token = jwt.sign({ 
                id: user.id, 
                username 
                }, JWT_SECRET );
            res.send({ 
                message: "you're logged in!", 
                token
                });
        } else {
            next({
                name: "IncorrectCredentialsError",
                message: "Username or password is incorrect!"
            });
        }
    } catch(error) {
        console.log(error);
        next(error);
    };
});

usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
  
        if (_user) {
            next({
            name: 'UserExistsError',
            message: 'A user by that username already exists'
            });
        }
    
        const user = await createUser({
            username,
            password,
            name,
            location,
        });
    
        const token = jwt.sign({ 
            id: user.id, 
            username
        }, JWT_SECRET, 
        {
            expiresIn: '1w'
        });
    
        res.send({ 
            message: "thank you for signing up",
            token 
        });
    } catch ({ name, message }) {
        next({ name, message })
    } 
});

module.exports = usersRouter;

//curl http://localhost:3000/api -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2NzQ3MDU4Mzl9.6VZ84WD9xyR2G-NorVlNK2XGHnFbgdgxr4x-8kCwdZs'