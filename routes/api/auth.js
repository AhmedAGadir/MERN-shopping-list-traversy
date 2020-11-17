const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User');

// @route  POST api/auth
// @desc   Authenticate user
// @access Public 
router.post('/', (req, res) => {
    const { email, password } = req.body;

    // simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // check for existing user
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }

            // validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'invalid credentials' })

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
                })
        })
})

// @route  GET api/auth/user
// @desc   get user data
// @access Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password') // dont return password
        .then(user => res.json(user))
})

// we use postman to test apis 
// we use http clients
// e.g. http://localhost:5000/api/users

module.exports = router;
