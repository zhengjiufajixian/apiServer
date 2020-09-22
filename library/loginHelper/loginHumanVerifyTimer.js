let redisClient = require('../../db/redisdb');
let config = require('../../config/sys_config.js');
let output_common = require('../../config/output_common');

/**
 * loginHumanVerifyTimerCheck
 * @param data
 * @param done
 *
 * get login verify times
 * check if login verify times exist
 * check if login verify times less than limit
 * check if login verify times equals to limit
 * check if login verify times exceed limit
 */
exports.loginHumanVerifyTimerCheck = function (data, done) {
    let key_value;

    let verify_times;

    // get login verify times
    new Promise(function (onFulfilled, onRejected) {
        key_value = data.key_value;

        redisClient.getVerifyTimes(key_value, function (error, result) {
            if (error) {
                return onRejected(output_common.LOGINHUMANVERIFYTIMER_REDIS_GET_ERR);
            }
            verify_times = result;
            onFulfilled();
        });
    })
    // check if login verify times exist
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (!verify_times) {
                    redisClient.setVerifyTimes(key_value, function (error) {
                        if (error) {
                            return onRejected(output_common.LOGINHUMANVERIFYTIMER_REDIS_SET_ERR);
                        }
                        onFulfilled();
                    });
                } else {
                    onFulfilled();
                }
            });
        })
        // check if login verify times less than limit
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (verify_times < config.login_retry_times) {
                    redisClient.incrVerifyTimes(key_value, function (error) {
                        if (error) {
                            return onRejected(output_common.LOGINHUMANVERIFYTIMER_REDIS_SET_ERR);
                        }
                        onFulfilled();
                    });
                } else {
                    onFulfilled();
                }
            });
        })
        // check if login verify times equals to limit
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (Number(verify_times) === Number(config.login_retry_times)) {
                    redisClient.incrVerifyTimes(key_value, function (error) {
                        if (error) {
                            return onRejected(output_common.LOGINHUMANVERIFYTIMER_REDIS_SET_ERR);
                        }
                        done(null, {need_captcha: true, captcha_check: false});
                    });
                } else {
                    onFulfilled();
                }
            });
        })
        // check if login verify times exceed limit
        .then(function onFulfilled() {
            return new Promise(function () {
                if (verify_times > config.login_retry_times) {
                    done(null, {need_captcha: true, captcha_check: true});
                } else {
                    done(null, {need_captcha: false, captcha_check: false});
                }
            });
        })
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }
            done(err_msg, null);
        });
};


/**
 * loginHumanVerifyTimerClear
 * @param data
 * @param done
 *
 * clear login verify times
 */

exports.loginHumanVerifyTimerClear = function (data, done) {
    let key_value = data.key_value;

    redisClient.delVerifyTimes(key_value, function (error) {
        if (error) {
            return done(output_common.LOGINHUMANVERIFYTIMER_REDIS_SET_ERR);
        }
        done(null, null);
    });
};