let clone = require('clone');

let validator = require('./../models/validator').validate;
let mysqlDB_query = require('./../db/mysqlDB').query;

let output_common = require('./../config/output_common');
let api_log = require('./../models/system_logs/system_logs').api_log;

let tools = require('./../library/tools');
let node_env = process.env.NODE_ENV;

exports.apiLog = function (req, res, next) {
    let action_user_id;
    let action_api;
    let action_user_ip;
    let action_time = tools.getDate();
    let client_type;

    new Promise(function (onFulfilled, onRejected) {
        action_api = req.originalUrl;
        if(node_env === 'production'){
            action_user_ip = req.headers['x-forwarded-for'].split(',')[0];
        }else{
            action_user_ip = req.connection.remoteAddress;
            if (action_user_ip.substr(0, 7) == "::ffff:") {
                action_user_ip = action_user_ip.substr(7)
            }
        }
        client_type = req.headers['client-type'];

        if (req.originalUrl.toLowerCase().indexOf('/callback/') > -1) {
            action_user_id = req.body['user_id'];
        } else {
            action_user_id = req.headers['key-value'];
        }

        // in the case of a Callback
        if (req.originalUrl.toLowerCase().indexOf('callback') !== -1) {
            action_user_id = req.body.user_id;
            client_type = req.body.client_type;
        }

        let input_op = [];
        input_op.push({table: 'api_log', attr: 'action_user_id', attr_value: action_user_id});
        input_op.push({table: 'api_log', attr: 'action_api', attr_value: action_api});
        input_op.push({table: 'api_log', attr: 'action_user_ip', attr_value: action_user_ip});
        input_op.push({table: 'api_log', attr: 'action_time', attr_value: action_time});
        input_op.push({table: 'api_log', attr: 'client_type', attr_value: client_type});

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
    // insert log
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = api_log.insert;
                let statement_op = [
                    {
                        action_user_id: action_user_id,
                        action_api: action_api,
                        action_user_ip: action_user_ip,
                        action_time: action_time,
                        client_type: client_type
                    }
                ];

                mysqlDB_query(statement, statement_op, function (error) {
                    if (error) {
                        res.json(output_common.DB_ERR);
                        return onRejected(output_common.DB_ERR);
                    }
                    onFulfilled();
                });
                next();
            });
        })
        // catch error
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }
        });
};