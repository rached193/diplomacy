'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash');

function UserCore(options) {
    this.core = options.core;
}

UserCore.prototype.create = function(options, cb) {
    var User = mongoose.model('User');
    var user = new User(options);

    user.save(cb);
};

UserCore.prototype.list = function(options, cb) {
    options = options || { };
    var User = mongoose.model('User');
    var query = User.find(_.pick({
        '_id': options.ID,
        'username': options.username
    }, _.identity));

    query.exec(function(err, users) {
        if (err) {
            console.error(err);
            return cb(err);
        }

        cb(null, users);
    });
};

module.exports = UserCore;
