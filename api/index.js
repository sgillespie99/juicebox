const express = require('express');
const apiRouter = express.Router();

// new

// Before we start attaching our routers

const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});



apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
  });


const usersRouter = require('./users');
const postsRouter = require('./posts');
const tagsRouter = require('./tags');
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);


// new

// all routers attached ABOVE here
apiRouter.use((error, req, res, next) => {
    res.send(error);
  });
  
  module.exports = apiRouter;

// // not sure if used yet:
// server.use(async (req, res, next) => {
//     const prefix = 'Bearer '
//     const auth = req.headers['Authorization'];
  
//     if (!auth) {
//       next(); // don't set req.user, no token was passed in
//     }
  
  
//     if (auth.startsWith(prefix)) {
//       // recover the token
//       const token = auth.slice(prefix.length);
//       try {
//         // recover the data
//         const { id } = jwt.verify(data, 'secret message');
  
//         // get the user from the database
//         const user = await getUserById(id);
//         // note: this might be a user or it might be null depending on if it exists
  
//         // attach the user and move on
//         req.user = user;
  
//         next();
//       } catch (error) {
//         // there are a few types of errors here
//       }
//     }
//   })

module.exports = apiRouter;