let clone = require('clone');
let validator = require('../models/validator').validate;
let mysqlDB_query = require('../db/mysqlDB').query;

let mgmt_user_basic = require('../models/mgmt_user/mgmt_user').mgmt_user_basic;
let output_mgmt = require('../config/output_mgmt');
let output_common = require('../config/output_common');
let mgmt_auth_config = require('../config/mgmt_auth_config').mgmt_auth_config;

/**
 * mgmtUserAuthLevelCheck
 * @params
 * mgmt_user_id
 */
exports.mgmtUserAuthLevelCheck = function (req, res, next) {
    let mgmt_user_id;
    let auth_level;

    return new Promise(function (onFulfilled, onRejected) {
        auth_level = mgmt_auth_config[req.originalUrl];
        if (req.originalUrl.toLowerCase().indexOf('/callback/') > -1) {
            mgmt_user_id = req.body['user_id'];
        } else {
            mgmt_user_id = req.headers['key-value'];
        }

        let input_op = [];
        input_op.push({table: 'mgmt_user_basic', attr: 'user_id', attr_value: mgmt_user_id.toString()});

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
    // check auth level
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (Boolean(auth_level) === false) {
                    res.json(output_mgmt.MGMTUSER_UNAUTH_USER);
                    return onRejected(output_mgmt.MGMTUSER_UNAUTH_USER);
                }

                let statement = mgmt_user_basic.select_where_and_in;
                let statement_op = [
                    {user_id: mgmt_user_id},
                    'mgmt_auth_level',
                    auth_level
                ];

                mysqlDB_query(statement, statement_op, function (error, rows) {
                    if (error) {
                        res.json(output_common.DB_ERR);
                        return onRejected(output_common.DB_ERR);
                    }
                    if (rows.length === 0) {
                        res.json(output_mgmt.MGMTUSER_UNAUTH_USER);
                        return onRejected(output_mgmt.MGMTUSER_UNAUTH_USER);
                    }

                    onFulfilled();
                    next();
                });
            });
        })
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }
        });
};