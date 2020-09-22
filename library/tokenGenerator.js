let jwt = require('jsonwebtoken');
let config = require('../config/sys_config.js');
let redisClient = require('../db/redisdb').redisClient;
let output_common = require("../config/output_common");

exports.genClient2bSubAccountToken = function (subaccount_key, done) {
    let expires_time_milsec = (new Date).getTime() + config.token_exp_milsec;
    let token = jwt.sign({"expire_time": expires_time_milsec}, config.token_secret, {algorithm: 'HS256'});

    //Save {subaccount_key + client2b_token_postfix: token} pair to redis
    redisClient.set(subaccount_key + config.client2b_token_postfix, token, function (error, reply) {
        if (error) {
            return done(output_common.TOKENGENERATOR_GEN_TOKEN_ERR, null)
        }

        console.log('redis token set: ' + reply.toString());
        done(null, token)
    });
};

exports.genClient2bToken = function (user_id, done) {
    let expires_time_milsec = (new Date).getTime() + config.token_exp_milsec;
    let token = jwt.sign({"expire_time": expires_time_milsec}, config.token_secret, {algorithm: 'HS256'});

    //Save {user_id + client2b_token_postfix: token} pair to redis
    redisClient.set(user_id + config.client2b_token_postfix, token, function (error, reply) {
        if (error) {
            return done(output_common.TOKENGENERATOR_GEN_TOKEN_ERR, null)
        }

        console.log('redis token set: ' + reply.toString());
        done(null, token)
    });
};

exports.genClient2cToken = function (user_id, done) {
    let expires_time_milsec = (new Date).getTime() + config.token_exp_milsec;
    let token = jwt.sign({"expire_time": expires_time_milsec}, config.token_secret, {algorithm: 'HS256'});

    //Save {user_id + client2c_token_postfix: token} pair to redis
    redisClient.set(user_id + config.client2c_token_postfix, token, function (error, reply) {
        if (error) {
            return done(output_common.TOKENGENERATOR_GEN_TOKEN_ERR, null)
        }

        console.log('redis token set: ' + reply.toString());
        done(null, token)
    });
};

exports.genMgmtToken = function (user_id, done) {
    let expires_time_milsec = (new Date).getTime() + config.token_exp_milsec;
    let token = jwt.sign({"expire_time": expires_time_milsec}, config.token_secret, {algorithm: 'HS256'});

    //Save {user_id + mgmt_token_postfix: token} pair to redis
    redisClient.set(user_id + config.mgmt_token_postfix, token, function (error, reply) {
        if (error) {
            return done(output_common.TOKENGENERATOR_GEN_TOKEN_ERR, null)
        }

        console.log('redis token set: ' + reply.toString());
        done(null, token)
    });
};