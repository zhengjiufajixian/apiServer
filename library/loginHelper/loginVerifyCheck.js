let clone = require('clone');
let tools = require('../../library/tools');
let mysqlDB_query = require('../../db/mysqlDB').query;

let config = require('../../config/sys_config');
let output_common = require('../../config/output_common');

let user_basic = require('../../models/user/user').user_basic;
let mgmt_user_basic = require('../../models/mgmt_user/mgmt_user').mgmt_user_basic;
let merchant_user_basic = require('../../models/merchant_user/merchant_user').merchant_user_basic;
let merchant_user_subaccount = require('../../models/merchant_user/merchant_user').merchant_user_subaccount;
let consumer_user_basic = require('../../models/consumer_user/consumer_user').consumer_user_basic;

let loginHumanVerifyTimer = require('./loginHumanVerifyTimer');
let tokenGenerator = require('../../library/tokenGenerator');
let humanVerifyCheck = require('../../library/humanVerifyHelper/humanVerifyCheck').humanVerifyCheck;
let checkVerifyCode = require('../../library/verifyCodeHelper/checkVerifyCode').checkVerifyCode;

/**
 * loginVerifyCheck
 * @param data
 * @param done
 *
 * check if username is phone or email
 * get user account info
 * check login human verify timer
 * humanVerifyCheck if needed
 * check if credentials are correct
 * check if account status are correct
 * check if account is forze
 * update last login time accordingly
 * generate user token
 */
exports.loginVerifyCheck = function (data, done) {
    let subaccount_username;
    let subaccount_password;
    let subaccount_merchant_user_id;
    let username;
    let password;
    let verify_code;
    let client_type;
    let device_type;
    let login_type;
    let auth_code;

    let user_basic_row;
    let username_type;
    let human_verify_result;
    let account_froze = false;
    let login_token;

    // check if username is phone or email
    new Promise(function (onFulfilled) {
        subaccount_username = data.subaccount_username;
        subaccount_password = data.subaccount_password;
        subaccount_merchant_user_id = data.subaccount_merchant_user_id;
        username = data.username;
        password = data.password;
        verify_code = data.verify_code;
        client_type = data.client_type;
        device_type = data.device_type;
        login_type = data.login_type;
        auth_code = data.auth_code;

        onFulfilled();
    })
    // get username_type
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                // 'merchant_subaccount' does not have username
                if (login_type === 'merchant_subaccount') {
                    return onFulfilled();
                }

                username_type = tools.checkUsernameType(username);
                if (!username_type) {
                    return onRejected(output_common.LOGINVERIFYCHECK_USERNAME_INCORRECT_ERR);
                }

                onFulfilled();
            });
        })
        // get user account info
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
                if (login_type === 'merchant_subaccount') {
                    statement_op = [
                        {user_id: subaccount_merchant_user_id}
                    ];
                }

                mysqlDB_query(statement, statement_op, function (error, rows) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    if (rows.length === 0) {
                        return onRejected(output_common.LOGINVERIFYCHECK_USERINFO_NOTFOUND_ERR);
                    }
                    user_basic_row = rows[0];
                    onFulfilled();
                });
            });
        })
        // check login human verify timer
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let options = {key_value: user_basic_row.user_id};
                loginHumanVerifyTimer.loginHumanVerifyTimerCheck(options, function (error, result) {
                    if (error) {
                        return onRejected(error);
                    }
                    human_verify_result = result;
                    onFulfilled();
                });
            });
        })
        // humanVerifyCheck if needed
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                // need to add humanVerifyCheck for android, ios
                if (Boolean(human_verify_result.captcha_check) === true && device_type === 'web') {
                    humanVerifyCheck(auth_code, function (error) {
                        if (error) {
                            return onRejected(error);
                        }
                        onFulfilled();
                    });
                } else {
                    onFulfilled();
                }
            });
        })
        // check if credentials are correct
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (login_type !== 'usernamepassword') {
                    return onFulfilled();
                }

                let statement = user_basic.select_and;
                let statement_op;

                if (username_type === 'phone') {
                    statement_op = [
                        {phone: username},
                        {password: password}
                    ];
                }
                if (username_type === 'email') {
                    statement_op = [
                        {email: username},
                        {password: password}
                    ];
                }

                mysqlDB_query(statement, statement_op, function (error, rows) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    if (rows.length === 0) {
                        return onRejected(output_common.LOGINVERIFYCHECK_USERINFO_INCORRECT_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        // check if credentials are correct
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (login_type !== 'merchant_subaccount') {
                    return onFulfilled();
                }

                let statement = merchant_user_subaccount.select_and2;
                let statement_op = [
                    {user_id: subaccount_merchant_user_id},
                    {subaccount_username: subaccount_username},
                    {subaccount_password: subaccount_password}
                ];

                mysqlDB_query(statement, statement_op, function (error, rows) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    if (rows.length === 0) {
                        return onRejected(output_common.LOGINVERIFYCHECK_USERINFO_INCORRECT_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        // check if credentials are correct
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (login_type !== 'verifycode') {
                    return onFulfilled();
                }

                let options = {
                    code: verify_code,
                    request_target: username,
                    target_type: username_type
                };

                if (username_type === 'phone') {
                    options.code_type = config.verify_code_type_phone_verify_code_login;
                }

                if (username_type === 'email') {
                    options.code_type = config.verify_code_type_email_verify_code_login;
                }

                checkVerifyCode(options, function (error) {
                    if (error) {
                        return onRejected(error);
                    }
                    onFulfilled();
                });
            });
        })
        // human verify timer clear
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let options = {key_value: user_basic_row.user_id};
                loginHumanVerifyTimer.loginHumanVerifyTimerClear(options, function (error) {
                    if (error) {
                        return onRejected(error);
                    }
                    onFulfilled();
                });
            });
        })
        // check if account is forze
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (client_type === 'mgmt') {
                    if (user_basic_row.mgmt_account_status === 'froze') {
                        account_froze = true;
                        return onRejected(output_common.LOGINVERIFYCHECK_USER_ACCOUNT_FORZE_ERR);
                    } else {
                        onFulfilled();
                    }
                }

                if (client_type === 'client2c') {
                    if (user_basic_row.consumer_account_status === 'froze') {
                        account_froze = true;
                        return onRejected(output_common.LOGINVERIFYCHECK_USER_ACCOUNT_FORZE_ERR);
                    } else {
                        onFulfilled();
                    }
                }

                if (client_type === 'client2b') {
                    if (user_basic_row.merchant_account_status === 'froze') {
                        account_froze = true;
                        return onRejected(output_common.LOGINVERIFYCHECK_USER_ACCOUNT_FORZE_ERR);
                    } else {
                        onFulfilled();
                    }
                }

            });
        })
        // update last login time accordingly
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement;
                let statement_op;

                if (client_type === 'mgmt') {
                    statement = mgmt_user_basic.update;
                    statement_op = [
                        {mgmt_last_login_time: tools.getDate()},
                        {user_id: user_basic_row.user_id}
                    ];
                }

                if (client_type === 'client2c') {
                    statement = consumer_user_basic.update;
                    statement_op = [
                        {consumer_last_login_time: tools.getDate()},
                        {user_id: user_basic_row.user_id}
                    ];
                }

                if (client_type === 'client2b') {
                    statement = merchant_user_basic.update;
                    statement_op = [
                        {merchant_last_login_time: tools.getDate()},
                        {user_id: user_basic_row.user_id}
                    ];
                }

                mysqlDB_query(statement, statement_op, function (error) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        // gen token
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (client_type === 'mgmt') {
                    tokenGenerator.genMgmtToken(user_basic_row.user_id, function (error, result) {
                        if (error) {
                            return onRejected(error);
                        }
                        login_token = result;
                        onFulfilled();
                    });
                }

                if (client_type === 'client2c') {
                    tokenGenerator.genClient2cToken(user_basic_row.user_id, function (error, result) {
                        if (error) {
                            return onRejected(error);
                        }
                        login_token = result;
                        onFulfilled();
                    });
                }

                if (client_type === 'client2b') {
                    tokenGenerator.genClient2bToken(user_basic_row.user_id, function (error, result) {
                        if (error) {
                            return onRejected(error);
                        }
                        login_token = result;
                        onFulfilled();
                    });
                }

               

            });
        })
        // reponse user_id and login_token
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled) {
                done(null, {
                    user_id: user_basic_row.user_id,
                    token: login_token
                });
                onFulfilled();
            });
        })
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }

            let response_json = clone(err_msg);
            response_json.result.account_froze = account_froze;

            if (human_verify_result) {
                response_json.result.need_captcha = human_verify_result.need_captcha;
            }
            done(response_json, null);
        });
};