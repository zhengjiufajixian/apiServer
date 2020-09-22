let clone = require('clone');

let validator = require('../../../models/validator').validate;
let mysqlDB_query = require('../../../db/mysqlDB').query;

let config = require('../../../config/sys_config');
let output_common = require("../../../config/output_common");
let tools = require("../../../library/tools");

let user_basic = require('../../../models/user/user').user_basic;

let checkVerifyCode = require("../../../library/verifyCodeHelper/checkVerifyCode").checkVerifyCode;
let createNewAccount = require("../../../library/registerHelper/createNewAccount").createNewAccount;

/**
 * 用户-普通注册
 * @params
 * username,
 * password,
 * verify_code
 */
exports.register = function (req, res) {
    let device_type;
    let username;
    let username_type;
    let password;
    let verify_code;

    let generated_user_nickname;
    let new_user_basic = {};
    let resultJson = {};

    new Promise(function (onFulfilled, onRejected) {
        device_type = req.headers['device-type'];
        username = req.body.username;
        password = req.body.password;
        verify_code = req.body.verify_code;

        username_type = tools.checkUsernameType(username);
        if (!username_type) {
            res.json(output_common.AUTH_REGISTER_USERNAME_INCORRECT_ERR);
            return onRejected(output_common.AUTH_REGISTER_USERNAME_INCORRECT_ERR);
        }

        let input_op = [];
        input_op.push({table: 'header', attr: 'device_type', attr_value: device_type});
        input_op.push({table: 'user_basic', attr: username_type, attr_value: username});
        input_op.push({table: 'user_basic', attr: 'password', attr_value: password});
        input_op.push({table: 'verify_code', attr: 'code', attr_value: verify_code});

        validator(input_op, function (error, error_op) {
            if (error) {
                let res_json = clone(output_common.VALIDATE_ERR);
                res_json.message = error_op.error_message;
                res_json.dev_message = error_op.error_message;
                res.json(res_json);
                return onRejected(res_json);
            }
            onFulfilled();
        });
    })
    //check if username is already registered
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = user_basic.select;
                let statement_op;

                if (username_type === 'phone') {
                    statement_op = [
                        {phone: username}
                    ];
                }
                if (username_type === 'email') {
                    statement_op = [
                        {email: username}
                    ];
                }

                mysqlDB_query(statement, statement_op, function (error, user_basic_rows) {
                    if (error) {
                        res.json(output_common.DB_ERR);
                        return onRejected(output_common.DB_ERR);
                    }
                    if (user_basic_rows.length > 0) {
                        res.json(output_common.AUTH_REGISTER_ALREADY_REGISTER_ERR);
                        return onRejected(output_common.AUTH_REGISTER_ALREADY_REGISTER_ERR);
                    }
                    onFulfilled();
                })
            })
        })
        // check verify_code
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let options = {
                    code: verify_code,
                    request_target: username,
                    target_type: username_type
                };

                if (username_type === 'phone') {
                    options.code_type = config.verify_code_type_phone_register;
                }
                if (username_type === 'email') {
                    options.code_type = config.verify_code_type_email_register;
                }

                checkVerifyCode(options, function (error) {
                    if (error) {
                        res.json(error);
                        return onRejected();
                    }
                    onFulfilled();
                });
            })
        })
        //generate generated_user_nickname
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled) {
                //YYYYMMDDHHmmSSS (13) + 5 DIGITS
                generated_user_nickname = tools.getDate("YYMMDDHHmmSSS") + tools.getRandomInt(5);
                onFulfilled();
            })
        })
        //createNewAccount
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let location_ip_address = req.headers['x-forwarded-for'];

                if (username_type === 'phone') {
                    new_user_basic.phone = username;
                }
                if (username_type === 'email') {
                    new_user_basic.email = username;
                }

                new_user_basic.password = password;
                new_user_basic.register_source = device_type;
                new_user_basic.register_time = tools.getDate();

                new_user_basic.user_nickname = generated_user_nickname;

                let options = {
                    location_ip_address: location_ip_address,
                    new_user_basic: new_user_basic
                };

                createNewAccount(options, function (error, user_id) {
                    if (error) {
                        res.json(error);
                        return onRejected();
                    }
                    new_user_basic.user_id = user_id;
                    onFulfilled();
                });
            })
        })
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled) {
                resultJson = new_user_basic.user_id;

                let success_res_json = clone(output_common.AUTH_REGISTER_SUCCESS);
                success_res_json.result = resultJson;
                res.json(success_res_json);
                onFulfilled();
            });
        })
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }
        });
};
