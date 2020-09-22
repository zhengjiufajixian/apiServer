let tools = require("../tools");
let config = require('../../config/sys_config.js');
let mysqlDB_query = require('../../db/mysqlDB').query;
let output_common = require("../../config/output_common");

let verify_code = require('../../models/verify_code/verify_code').verify_code;


/**
 * checkVerifyCodePolicy
 * @params
 * data
 * done
 *
 * find associated verify_code_rows
 * check verify_code_rows create_time
 *
 */

exports.checkVerifyCodePolicy = function (data, done) {
    let phone;
    let email;
    let code_type;

    let verify_code_rows;

    new Promise(function (onFulfilled) {
        phone = data.phone;
        email = data.email;
        code_type = data.code_type;

        onFulfilled();
    })
    // find associated verify_code_rows
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = verify_code.select_in_order_by_desc_Limit;
                let statement_op;

                if (phone) {
                    statement_op = [
                        ['request_target', 'code_type'],
                        [[phone, code_type]],
                        'create_time',
                        config.verify_code_text_request_freq_limit
                    ]
                }
                if (email) {
                    statement_op = [
                        ['request_target', 'code_type'],
                        [[email, code_type]],
                        'create_time',
                        config.verify_code_email_request_freq_limit
                    ]
                }

                mysqlDB_query(statement, statement_op, function (error, rows) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    verify_code_rows = rows;
                    onFulfilled();
                });
            })
        })
        // check verify_code_rows create_time
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (verify_code_rows.length <= 0) {
                    return done(null, null);
                }

                let latest_verify_code_create_time = parseInt(verify_code_rows[0].create_time);

                if (phone) {
                    if (verify_code_rows.length >= config.verify_code_text_request_freq_limit) {
                        if (latest_verify_code_create_time + config.verify_code_text_request_freq_limit_milsec < tools.getTime()) {
                            return done(null, null);
                        } else {
                            return onRejected(output_common.CHECKVERIFYCODEPOLICY_REQUEST_TOO_FREQ);
                        }
                    }
                }

                if (email) {
                    if (verify_code_rows.length >= config.verify_code_email_request_freq_limit) {
                        if (latest_verify_code_create_time + config.verify_code_email_request_freq_limit_milsec < tools.getTime()) {
                            return done(null, null);
                        } else {
                            return onRejected(output_common.CHECKVERIFYCODEPOLICY_REQUEST_TOO_FREQ);
                        }
                    }
                }

                return done(null, null);
            })
        })
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }
            done(err_msg, null);
        })

};