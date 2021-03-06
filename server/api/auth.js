module.exports = function() {
    var hashOptions = {
        'DEFAULT_HASH_ITERATIONS': 32000,
        'SALT_SIZE': 64,
        'KEY_LENGTH': 128
    };
    var SESSION_LENGTH = 60 * 4;

    var express = require('express.oi'),
        app = express(),
        pbkdf2 = require('easy-pbkdf2')(hashOptions),
        passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        jwt = require('jsonwebtoken'),
        mongoose = require('mongoose');

    var seekrits;
    try {
        seekrits = require('../config/local.env');
    }
    catch (ex) {
        if (ex.code === 'MODULE_NOT_FOUND')
            seekrits = require('../config/local.env.sample');
    }
    

    // passport config
    passport.use(new LocalStrategy(
        function(username, password, done) {
            try {
                require('../models/user').User
                    .findOne({ 'username': username }, function(err, maybeUser) {
                        // if no results, stop trying
                        if (!maybeUser)
                            return done(null, false, { error: 'Invalid username and/or password.' });

                        // if a match was found, test against the stored hash
                        pbkdf2.verify(maybeUser.passwordsalt, maybeUser.password, password, function(err, match) {
                            if (match)
                                return done(null, maybeUser);
                            else if (!match)
                                return done(null, false, { error: 'Incorrect username and/or password.' });
                            else
                                return done(err);
                        });
                    });
            }
            catch (ex) {
                return done('There was a problem authenticating you. Please try again later.');
            }
        })
    );

    app.post('/login', function(req, res, next) {
        var token;

        // basic authentication
        passport.authenticate('local', function(err, user) {
            if (err) { return next(err); }
            if (!user) { return res.status(401).json({ error: 'Incorrect username and/or password.' }); }

            var safeUser = {
                username: user.username,
                id: user._id
            };

            token = jwt.sign(safeUser, seekrits.SESSION_SECRET, { expiresInMinutes: SESSION_LENGTH });
            res.json({ id: user._id, token: token, refreshtoken: user.refreshtoken });
        })(req, res, next);
    });

    app.post('/users', function(req, res, next) {
        var salt = pbkdf2.generateSalt();
        pbkdf2.secureHash(req.body.password, salt, function(err, hash, salt) {
            var user = new require('../models/user').User({
                username: req.body.username,
                password: hash,
                passwordsalt: salt,
                refreshtoken: pbkdf2.random(10).toString('hex'),
                email: req.body.email,
                points: 0
            });

            user.save();
            return res.sendStatus(201);
        });
    });

    return app;
};
