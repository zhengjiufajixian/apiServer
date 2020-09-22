let jwt = require("jsonwebtoken");
let redisClient = require("../db/redisdb").redisClient;
let config = require("../config/sys_config.js");

let output_common = require("../config/output_common");
let tools = require("../library/tools");

exports.tokenvalidation = function (req, res, next) {
    let redis_key;

    let client_type;
    let user_id;
    let token;

    let redis_token;
    let decoded_token;

    return (
        new Promise(function (onFulfilled) {
            user_id = req.headers["key-value"];
            token = req.headers["access-token"];
            client_type = req.headers["client-type"];

            // in the case of a Callback
            if (req.originalUrl.toLowerCase().indexOf("callback") !== -1) {
                user_id = req.body.user_id;
                token = req.body.token;
                client_type = req.body.client_type;
            }
            onFulfilled();
        })
            // decoded
            .then(function onFulfilled() {
                return new Promise(function (onFulfilled, onRejected) {
                    if (Boolean(token) && Boolean(user_id)) {
                        jwt.verify(token, config.token_secret, function (
                            error,
                            result
                        ) {
                            if (error) {
                                res.json(
                                    output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_EXPIRED
                                );
                                return onRejected(
                                    output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_EXPIRED
                                );
                            }
                            decoded_token = result;
                            onFulfilled();
                        });
                    } else {
                        res.json(
                            output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_DENIED
                        );
                        return onRejected(
                            output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_DENIED
                        );
                    }
                });
            })
            //check expire_time
            .then(function onFulfilled() {
                return new Promise(function (onFulfilled, onRejected) {
                    if (decoded_token.expire_time > tools.getTime()) {
                        if (client_type === "mgmt") {
                            redis_key = user_id + config.mgmt_token_postfix;
                        }
                        if (client_type === "client2c") {
                            redis_key = user_id + config.client2c_token_postfix;
                        }
                        if (client_type === "client2b") {
                            redis_key = user_id + config.client2b_token_postfix;
                        }

                        redisClient.get(redis_key, function (error, result) {
                            if (error) {
                                res.json(output_common.DB_ERR);
                                return onRejected(output_common.DB_ERR);
                            }
                            redis_token = result;
                            onFulfilled();
                        });
                    } else {
                        res.json(
                            output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_EXPIRED
                        );
                        return onRejected(
                            output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_EXPIRED
                        );
                    }
                });
            })
            .then(function onFulfilled() {
                return new Promise(function (onFulfilled, onRejected) {
                    if (redis_token === null) {
                        res.json(
                            output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_DENIED
                        );
                        return onRejected(
                            output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_DENIED
                        );
                    } else if (token !== redis_token) {
                        res.json(
                            output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_DENIED
                        );
                        return onRejected(
                            output_common.MIDDLEWARE_TOKENVALIDATE_TOKEN_DENIED
                        );
                    }
                    next();
                    onFulfilled();
                });
            })
            .catch(function onRejected(err_msg) {
                if (err_msg) {
                    console.log(err_msg);
                }
            })
    );
};
