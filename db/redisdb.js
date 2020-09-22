let redis = require('redis');
let config = require('../config/sys_config.js');

let redisdb_host = config.redisdb_host;
let redisdb_port = config.redisdb_port;
let redisClient;

redisClient = redis.createClient({
    host: redisdb_host,
    port: redisdb_port,
    detect_buffers: true
});

redisClient.on('error', function (error) {
    console.log(redisdb_host + ":" + redisdb_port + " " + error);
});

redisClient.on('connect', function () {
    console.log('Redis connected ' + redisdb_host + ":" + redisdb_port);
});

exports.getVerifyTimes = function (key, done) {
    redisClient.get(key + config.login_human_verify_postfix, function (error, reply) {
        if (error) {
            return done(error, null);
        }
        done(null, reply);
    });
};

exports.incrVerifyTimes = function (key, done) {
    redisClient.incr(key + config.login_human_verify_postfix, function (error, reply) {
        if (error) {
            return done(error, null);
        }
        done(null, reply);
    });
};

exports.setVerifyTimes = function (key, done) {
    let initial_value = 0;

    redisClient.set(key + config.login_human_verify_postfix, initial_value, function (error, reply) {
        if (error) {
            return done(error, null);
        }
        done(null, reply);
    });
};

exports.delVerifyTimes = function (key, done) {
    redisClient.del(key + config.login_human_verify_postfix, function (error, reply) {
        if (error) {
            return done(error, null);
        }
        done(null, reply);
    });
};

exports.frozeConsumerAccount = function (key, done) {
    redisClient.del(key + config.client2c_token_postfix, function (error, reply) {
        if (error) {
            return done(error, null);
        }
        done(null, reply);
    });
};

exports.redisClient = redisClient;