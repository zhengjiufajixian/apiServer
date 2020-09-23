let clone = require('clone');

let validator = require('../../../models/validator').validate;
let mysqlDB_query = require('../../../db/mysqlDB').query;

let verify_code_table = require('../../../models/verify_code/verify_code').verify_code;
let user_basic = require('../../../models/user/user').user_basic;

let config = require('../../../config/sys_config.js');
let tools = require('../../../library/tools');
let output_common = require('../../../config/output_common');

// let emailSender = require('../../../queue/realtimeQueueHelper/emailSender');
// let emailVerifyCodeContent = require('../../../library/emailContentHelper/emailVerifyCodeContent').emailVerifyCodeContent;
let checkVerifyCodePolicy = require('../../../library/verifyCodeHelper/checkVerifyCodePolicy').checkVerifyCodePolicy;
let humanVerifyCheck = require('../../../library/humanVerifyHelper/humanVerifyCheck').humanVerifyCheck;

/**
 * 用户-获取邮件验证码
 * @params
 * email,
 * code_type,
 * auth_code
 */
exports.getEmailVerifyCode = function (req, res) {
    let client_type;
    let email;
    let code_type;
    let auth_code;

    // let verify_message;
    let verify_code;
    let user_basic_row;
    // let ready_to_send = false;

    new Promise(function (onFulfilled, onRejected) {
        client_type = req.headers['client-type'];
        email = req.body.email;
        code_type = req.body.code_type;
        auth_code = req.body.auth_code;

        let input_op = [];
        input_op.push({table: 'header', attr: 'client_type', attr_value: client_type});
        input_op.push({table: 'user_basic', attr: 'email', attr_value: email});
        input_op.push({table: 'verify_code', attr: 'code_type', attr_value: code_type});

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
    // checkVerifyCodePolicy
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let options = {
                    email: email,
                    code_type: code_type
                };

                checkVerifyCodePolicy(options, function (error) {
                    if (error) {
                        res.json(error);
                        return onRejected();
                    }
                    onFulfilled();
                });
            });
        })
        // verify auth_code
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                humanVerifyCheck(auth_code, function (error) {
                    if (error) {
                        return onRejected(error);
                    }
                    onFulfilled();
                });
            });
        })
        // make message ready to use
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled) {
                verify_code = tools.getRandomInt(config.verify_code_length);

                // if (String(code_type) === String(config.verify_code_type_email_register)) {
                //     verify_message = verify_code + ' , 您正在进行用户注册, 请勿向任何人泄露您的验证码。';
                // }
                // if (String(code_type) === String(config.verify_code_type_email_edit_email)) {
                //     verify_message = verify_code + ' , 您正在进行邮箱地址绑定, 请勿向任何人泄露您的验证码。';
                // }
                // if (String(code_type) === String(config.verify_code_type_email_reset_password)) {
                //     verify_message = verify_code + ' , 您正在进行密码修改, 请勿向任何人泄露您的验证码。';
                // }
                // if (String(code_type) === String(config.verify_code_type_email_verify_code_login)) {
                //     verify_message = verify_code + ' , 您正在进行登录, 请勿向任何人泄露您的验证码。';
                // }
                onFulfilled();
            });
        })
        // check if email in registered
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = user_basic.select;
                let statement_op = [
                    {email: email}
                ];

                mysqlDB_query(statement, statement_op, function (error, rows) {
                    if (error) {
                        res.json(output_common.DB_ERR);
                        return onRejected(output_common.DB_ERR);
                    }
                    user_basic_row = rows[0];
                    onFulfilled();
                });
            });
        })
        // judge if message is ready to send
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                // if email is not registered, send verify_message
                if (String(code_type) === String(config.verify_code_type_email_register)
                    || String(code_type) === String(config.verify_code_type_email_edit_email)) {
                    if (user_basic_row) {
                        res.json(output_common.AUTH_GETEMAILVERIFYCODE_EMAIL_ALREADY_REG);
                        return onRejected(output_common.AUTH_GETEMAILVERIFYCODE_EMAIL_ALREADY_REG);
                    } else {
                        // ready_to_send = true;
                    }
                }

                // if email is registered, send verify_message
                if (String(code_type) === String(config.verify_code_type_email_reset_password)
                    || String(code_type) === String(config.verify_code_type_email_verify_code_login)) {
                    if (user_basic_row) {
                        // ready_to_send = true;
                    } else {
                        res.json(output_common.AUTH_GETEMAILVERIFYCODE_EMAIL_NO_EXIST);
                        return onRejected(output_common.AUTH_GETEMAILVERIFYCODE_EMAIL_NO_EXIST);
                    }
                }
                onFulfilled();
            });
        })
        // save verify_code
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = verify_code_table.insert;
                let statement_op = [
                    {
                        request_target: email,
                        target_type: 'email',
                        code: verify_code,
                        code_type: code_type,
                        valid: true,
                        create_time: tools.getDate(),
                        expire_time: tools.getVerifyCodeExpTime(code_type),
                        try_count: 0,
                        use_time: null
                    }
                ];

                mysqlDB_query(statement, statement_op, function (error, result) {
                    if (error) {
                        res.json(output_common.DB_ERR);
                        return onRejected(output_common.DB_ERR);
                    }
                    if (result.affectedRows === 0) {
                        res.json(output_common.AUTH_GETEMAILVERIFYCODE_SAVE_ERR);
                        return onRejected(output_common.AUTH_GETEMAILVERIFYCODE_SAVE_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        //send verify_code
        // .then(function onFulfilled() {
        //     return new Promise(function (onFulfilled, onRejected) {
        //         let mailOptions = config.sendEmailOptions;
        //         mailOptions.to = email;
        //         mailOptions.html = emailVerifyCodeContent(verify_message);

        //         emailSender.sendEmail(mailOptions, function (error, result) {
        //             if (error) {
        //                 res.json(error);
        //                 return onRejected();
        //             }
        //             onFulfilled();
        //         });
        //     });
        // })
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled) {
                // res.json(output_common.AUTH_GETEMAILVERIFYCODE_SUCCESS);
                res.json({
                    status: 1,
                    result: {
                        verify_code:verify_code
                    },
                    message: '获取邮箱验证码成功',
                    dev_message: '获取邮箱验证码成功'
                });
                onFulfilled();
            });
        })
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }
        });
};