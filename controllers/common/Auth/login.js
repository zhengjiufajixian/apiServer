let clone = require("clone");
let validator = require("../../../models/validator").validate;
let output_common = require("../../../config/output_common");
let loginVerifyCheck = require("../../../library/loginHelper/loginVerifyCheck")
    .loginVerifyCheck;

/**
 * 用户-普通登录
 * @params
 * username,
 * password
 * auth_code
 */
exports.login = function (req, res) {
    let client_type;
    let username;
    let password;
    let auth_code;

    let user_id;
    let token;
    let resultJson = {};

    new Promise(function (onFulfilled, onRejected) {
        client_type = req.headers["client-type"];
        username = req.body.username;
        password = req.body.password;
        auth_code = req.body.auth_code;

        let input_op = [];
        input_op.push({
            table: "header",
            attr: "client_type",
            attr_value: client_type,
        });
        input_op.push({
            table: "user_basic",
            attr: "password",
            attr_value: password,
        });

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
        // login
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let options = {
                    client_type: client_type,
                    username: username,
                    password: password,
                    auth_code: auth_code,
                    login_type: "usernamepassword",
                };

                loginVerifyCheck(options, function (error, result) {
                    if (error) {
                        res.json(error);
                        return onRejected();
                    }

                    user_id = result.user_id;
                    token = result.token;
                    onFulfilled();
                });
            });
        })
        //success
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled) {
                resultJson.user_id = user_id;
                resultJson.token = token;

                let success_json = clone(output_common.AUTH_LOGIN_SUCCESS);
                success_json.result = resultJson;
                res.json(success_json);
                onFulfilled();
            });
        })
        .catch(function onRejected(err_msg) {
            if (err_msg) {
                console.log(err_msg);
            }
        });
};
