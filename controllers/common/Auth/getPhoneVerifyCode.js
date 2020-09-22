let clone = require('clone');

let validator = require('../../../models/validator').validate;
let mysqlDB_query = require('../../../db/mysqlDB').query;

let verify_code_table = require('../../../models/verify_code/verify_code').verify_code;
let user_basic = require('../../../models/user/user').user_basic;

let config = require('../../../config/sys_config.js');
let tools = require('../../../library/tools');
let output_common = require('../../../config/output_common');

let textMessager = require('../../../queue/realtimeQueueHelper/textMessager');
let checkVerifyCodePolicy = require('../../../library/verifyCodeHelper/checkVerifyCodePolicy').checkVerifyCodePolicy;
let humanVerifyCheck = require('../../../library/humanVerifyHelper/humanVerifyCheck').humanVerifyCheck;

/**
 * 用户-获取手机验证码
 * @params
 * phone,
 * code_type,
 * auth_code
 */
exports.getPhoneVerifyCode = function (req, res) {
    let client_type;
    let phone;
    let code_type;
    let auth_code;

    let verify_message;
    let verify_code;
    let user_basic_row;
    let ready_to_send = false;

    new Promise(function (onFulfilled, onRejected) {
        client_type = req.headers['client-type'];
        phone = req.body.phone;
        code_type = req.body.code_type;
        auth_code = req.body.auth_code;

        let input_op = [];
        input_op.push({table: 'header', attr: 'client_type', attr_value: client_type});
        input_op.push({table: 'user_basic', attr: 'phone', attr_value: phone});
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
                    phone: phone,
                    code_type: code_type
                };

                checkVerifyCodePolicy(options, function (error, result) {
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
                humanVerifyCheck(auth_code, function (error, result) {
                    if (error) {
                        res.json(error);
                        return onRejected(error);
                    }
                    onFulfilled();
                });
            });
        })
        // make text message ready to use
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled) {
                verify_code = tools.getRandomInt(config.verify_code_length);

                if (String(code_type) === String(config.verify_code_type_phone_register)) {
                    verify_message = '【河马印】验证码' + verify_code + '。您正在进行用户注册, 请勿向任何人泄露您的验证码。【河马印】';
                }
                if (String(code_type) === String(config.verify_code_type_phone_edit_phone)) {
                    verify_message = '【河马印】 验证码' + verify_code + '。您正在进行手机号绑定, 请勿向任何人泄露您的验证码。【河马印】';
                }
                if (String(code_type) === String(config.verify_code_type_phone_reset_password)) {
                    verify_message = '【河马印】验证码' + verify_code + '。您正在进行密码修改, 请勿向任何人泄露您的验证码。【河马印】';
                }
                if (String(code_type) === String(config.verify_code_type_phone_temp_register)) {
                    verify_message = '【河马印】验证码' + verify_code + '。您正在进行临时注册, 请勿向任何人泄露您的验证码。【河马印】';
                }
                if (String(code_type) === String(config.verify_code_type_phone_verify_code_login)) {
                    verify_message = '【河马印】验证码' + verify_code + '。您正在进行登录, 请勿向任何人泄露您的验证码。【河马印】';
                }
                onFulfilled();
            });
        })
        // check if phone in registered
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = user_basic.select;
                let statement_op = [
                    {phone: phone}
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
                // if phone is not registered, send verify_message
                if (String(code_type) === String(config.verify_code_type_phone_register)
                    || String(code_type) === String(config.verify_code_type_phone_edit_phone)
                    || String(code_type) === String(config.verify_code_type_phone_temp_register)) {
                    if (user_basic_row) {
                        res.json(output_common.AUTH_GETPHONEVERIFYCODE_PHONE_ALREADY_REG);
                        return onRejected(output_common.AUTH_GETPHONEVERIFYCODE_PHONE_ALREADY_REG);
                    } else {
                        ready_to_send = true;
                    }
                }

                // if phone is registered, send verify_message
                if (String(code_type) === String(config.verify_code_type_phone_reset_password)
                    || String(code_type) === String(config.verify_code_type_phone_verify_code_login)) {
                    if (user_basic_row) {
                        ready_to_send = true;
                    } else {
                        res.json(output_common.AUTH_GETPHONEVERIFYCODE_PHONE_NO_EXIST);
                        return onRejected(output_common.AUTH_GETPHONEVERIFYCODE_PHONE_NO_EXIST);
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
                        request_target: phone,
                        target_type: 'phone',
                        code: verify_code,
                        code_type: code_type,
                        valid: true,
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
                        res.json(output_common.AUTH_GETPHONEVERIFYCODE_SAVE_ERR);
                        return onRejected(output_common.AUTH_GETPHONEVERIFYCODE_SAVE_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        //send verify code
        // .then(function onFulfilled() {
        //     return new Promise(function (onFulfilled, onRejected) {
        //         let options = {
        //             mobile: phone,
        //             message: verify_message
        //         };

        //         textMessager.sendMsgToQueue(options, function (error) {
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
                // res.json(output_common.AUTH_GETPHONEVERIFYCODE_SUCCESS);
                res.json({
                    status: 1,
                    result: {
                        verify_code:verify_code
                    },
                    message: '获取手机验证码成功',
                    dev_message: '获取手机验证码成功'
                })
                onFulfilled();
            });
        })
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }
        });
};
