let tools = require("../tools");
let config = require('../../config/sys_config.js');

let mysqlDB_query = require('../../db/mysqlDB').query;
let verify_code = require('../../models/verify_code/verify_code').verify_code;

let output_common = require("../../config/output_common");

/**
 * checkVerifyCode
 * @params data
 * @param done
 *
 * select verify_code
 * check if verify code is valid
 * check if verify code is expired
 * check if verify code try count exceed
 * check if verify code match
 * all checks clear
 *
 */
exports.checkVerifyCode = function (data, done) {

    let code;
    let request_target;
    let target_type;
    let code_type;

    let verify_code_row;

    // select verify_code
    new Promise(function (onFulfilled, onRejected) {
        code = data.code;
        request_target = data.request_target;
        target_type = data.target_type;
        code_type = data.code_type;

        let statement = verify_code.select_in_order_by_desc_Limit;
        let statement_op = [
            ['code', 'request_target', 'target_type', 'code_type'],
            [[code, request_target, target_type, code_type]],
            'create_time',
            1
        ];

        mysqlDB_query(statement, statement_op, function (error, rows) {
            if (error) {
                return onRejected(output_common.DB_ERR);
            }
            if (rows.length == 0) {
                return onRejected(output_common.CHECKVERIFYCODE_VERIFYCODE_NOT_EXIST);
            }
            verify_code_row = rows[0];
            onFulfilled();
        });
    })
    // check if verify code is valid
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (Boolean(verify_code_row.valid) == false) {
                    return onRejected(output_common.CHECKVERIFYCODE_VERIFYCODE_NOT_VALID);
                } else {
                    onFulfilled();
                }
            })
        })
        // check if verify code is expired
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (verify_code_row.expire_time < tools.getDate()) {
                    let statement = verify_code.update;
                    let statement_op = [
                        {valid: false},
                        {verify_code_id: verify_code_row.verify_code_id}
                    ];

                    mysqlDB_query(statement, statement_op, function (error) {
                        if (error) {
                            return onRejected(output_common.DB_ERR);
                        }
                        return onRejected(output_common.CHECKVERIFYCODE_VERIFYCODE_EXPIRED);
                    });
                } else {
                    onFulfilled();
                }
            })
        })
        // check if verify code try count exceed
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let exceed_valid_retry_times = true;

                if (target_type == 'phone') {
                    exceed_valid_retry_times =
                        (verify_code_row.try_count >= config.verify_code_text_valid_retry_times)
                }
                if (target_type == 'email') {
                    exceed_valid_retry_times =
                        (verify_code_row.try_count >= config.verify_code_email_valid_retry_times)
                }

                if (exceed_valid_retry_times) {
                    let statement = verify_code.update;
                    let statement_op = [
                        {valid: false},
                        {verify_code_id: verify_code_row.verify_code_id}
                    ];

                    mysqlDB_query(statement, statement_op, function (error) {
                        if (error) {
                            return onRejected(output_common.DB_ERR);
                        }
                        return onRejected(output_common.CHECKVERIFYCODE_VERIFYCODE_OUT_OF_TRY);
                    });
                } else {
                    onFulfilled();
                }
            })
        })
        // check if verify code match
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (verify_code_row.code != code) {
                    let statement = verify_code.update;
                    let statement_op = [
                        {try_count: verify_code_row.try_count + 1},
                        {verify_code_id: verify_code_row.verify_code_id}
                    ];

                    mysqlDB_query(statement, statement_op, function (error) {
                        if (error) {
                            return onRejected(output_common.DB_ERR);
                        }
                        return onRejected(output_common.CHECKVERIFYCODE_VERIFYCODE_NOT_MISMATCH);
                    });
                } else {
                    onFulfilled();
                }
            })
        })
        // all checks clear
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = verify_code.update;
                let statement_op = [
                    {
                        valid: false,
                        try_count: verify_code_row.try_count + 1,
                        use_time: tools.getDate()
                    },
                    {verify_code_id: verify_code_row.verify_code_id}
                ];

                mysqlDB_query(statement, statement_op, function (error, result) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    if (result.affectedRows == 0) {
                        return onRejected(output_common.CHECKVERIFYCODE_VERIFYCODE_UPDATE_ERR);
                    }
                    return done(null, null);
                });
            })
        })
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }

            done(err_msg, null);
        })
};
