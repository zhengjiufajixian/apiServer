let tools = require("../library/tools");
let config = require("../config/sys_config.js");
let redisClient = require("../db/redisdb").redisClient;

let output_common = require("../config/output_common");

/*********************** limiter_record ***********************/
/*
 // config.limiter_token_prefix + ip + api + user_id + sub_account
 'v3_limiter_2_0_0_120_163_0_1/auth/login' : 1870938745
 */

//check limiter_record api time
exports.limiterCheck = function (req, res, next) {
    let key =
        config.limiter_token_prefix +
        req.ip +
        req.originalUrl +
        req.headers["key-value"];

    let limiter_record;

    //get limiter record from redis db
    return (
        new Promise(function (onFulfilled, onRejected) {
            redisClient.get(key, function (error, reply) {
                if (error) {
                    res.json(output_common.DB_ERR);
                    return onRejected(output_common.DB_ERR);
                }

                limiter_record = reply;
                onFulfilled();
            });
        })
            //check limiter_record
            .then(function onFulfilled() {
                return new Promise(function (onFulfilled, onRejected) {
                    //if does not exist a limiter record
                    if (limiter_record == null) {
                        redisClient.set(key, tools.getTime(), function (error) {
                            if (error) {
                                res.json(output_common.DB_ERR);
                                return onRejected(output_common.DB_ERR);
                            }

                            onFulfilled();
                        });
                        //if exist a limiter record
                    } else {
                        //if it has been more than limiter_time_gap
                        if (
                            parseInt(limiter_record) + config.limiter_time_gap >
                            tools.getTime()
                        ) {
                            //too frequent and update time
                            redisClient.set(key, tools.getTime(), function (
                                error
                            ) {
                                if (error) {
                                    res.json(output_common.DB_ERR);
                                    return onRejected(output_common.DB_ERR);
                                }

                                res.json(
                                    output_common.MIDDLEWARE_LIMITER_TOO_FREQ
                                );
                                return onRejected(
                                    output_common.MIDDLEWARE_LIMITER_TOO_FREQ
                                );
                            });
                        } else {
                            //update time
                            redisClient.set(key, tools.getTime(), function (
                                error
                            ) {
                                if (error) {
                                    res.json(output_common.DB_ERR);
                                    return onRejected(output_common.DB_ERR);
                                }

                                onFulfilled();
                            });
                        }
                    }
                });
            })
            // all clear
            .then(function onFulfilled() {
                return new Promise(function (onFulfilled) {
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
