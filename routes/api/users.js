const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User');

// @route  POST api/items
// @desc   Register new user
// @access Public 
router.post('/', (req, res) => {
    // res.send('register');
    const { name, email, password } = req.body;

    // simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // check for existing user
    User.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }
            const newUser = new User({
                name,
                email,
                password
            });

            // create salt & hash so we don't push passwords to database
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {

                            // when we send a token from react/postman, the user ID is in there
                            // useful for verification 
                            jwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 }, // expires in 1 hour
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            email: user.email
                                        }
                                    });
                                }
                            )

                            // res.json({
                            //     user: {
                            //         id: user.id,
                            //         name: user.name,
                            //         email: user.email
                            //     }
                            // });
                        })
                })
            })
        })
})

// we use postman to test apis 
// we use http clients
// e.g. http://localhost:5000/api/users

module.exports = router;
