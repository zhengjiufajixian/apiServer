let config = require('../../config/sys_config');
let output_common = require('../../config/output_common');

let mysqlDB_getConnection = require('../../db/mysqlDB').getConnection;

let user_basic = require('../../models/user/user').user_basic;
let consumer_user_basic = require('../../models/consumer_user/consumer_user').consumer_user_basic;
let merchant_user_basic = require('../../models/merchant_user/merchant_user').merchant_user_basic;
let merchant_user_accounting = require('../../models/merchant_user/merchant_user').merchant_user_accounting;
let user_register_log = require('../../models/system_logs/system_logs').user_register_log;

exports.createNewAccount = function (data, done) {
    let location_ip_address;
    let new_user_basic;

    let connection;

    let user_id;
    let register_ip_location;

    new Promise(function (onFulfilled, onRejected) {
        new_user_basic = data.new_user_basic;
        location_ip_address = data.location_ip_address;

        mysqlDB_getConnection(function (error, mysqlDB_connection) {
            if (error) {
                return onRejected(output_common.DB_ERR);
            }

            connection = mysqlDB_connection;
            onFulfilled();
        });
    })
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                connection.beginTransaction(function (error) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        //save user_basic
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = user_basic.insert;
                let statement_op = [{}];

                if (new_user_basic.email) {
                    statement_op[0].email = new_user_basic.email;
                }
                if (new_user_basic.phone) {
                    statement_op[0].phone = new_user_basic.phone;
                }
                if (new_user_basic.password) {
                    statement_op[0].password = new_user_basic.password;
                }

                connection.query(statement, statement_op, function (error, result) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    user_id = result.insertId;
                    onFulfilled();
                });
            });
        })
        //init user_register_log
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                if (location_ip_address) {
                    try {
                        let maxmind_location = config.maxmind_lookup.get(location_ip_address);
                        register_ip_location =
                            maxmind_location.continent.names['zh-CN'] +
                            maxmind_location.country.names['zh-CN'] +
                            maxmind_location.city.names['zh-CN'];
                    }
                    catch (error) {
                        console.log(error);
                    }
                }

                let statement = user_register_log.insert;
                let statement_op = [{
                    user_id: user_id,
                    register_ip_location: register_ip_location
                }];

                connection.query(statement, statement_op, function (error) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        //init consumer_user_basic
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = consumer_user_basic.insert;
                let statement_op = [{
                    user_id: user_id,
                    consumer_nickname: new_user_basic.user_nickname,
                    consumer_profile_image_uuid: config.default_user_profile_image_filename,
                    consumer_profile_image_ext: config.default_user_profile_image_file_ext
                }];

                connection.query(statement, statement_op, function (error) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        //init merchant_user_basic
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = merchant_user_basic.insert;
                let statement_op = [{
                    user_id: user_id,
                    merchant_nickname: new_user_basic.user_nickname,
                    merchant_profile_image_uuid: config.default_user_profile_image_filename,
                    merchant_profile_image_ext: config.default_user_profile_image_file_ext,
                    merchant_location: register_ip_location
                }];

                connection.query(statement, statement_op, function (error) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        //init merchant_user_accounting
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                let statement = merchant_user_accounting.insert;
                let statement_op = [{
                    user_id: user_id
                }];

                connection.query(statement, statement_op, function (error) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    onFulfilled();
                });
            });
        })
        .then(function onFulfilled() {
            return new Promise(function (onFulfilled, onRejected) {
                connection.commit(function (error) {
                    if (error) {
                        return onRejected(output_common.DB_ERR);
                    }
                    connection.release();
                    done(null, {user_id: user_id});
                    onFulfilled();
                });
            });
        })
        .catch(function onRejected(err_msg) {
            if (connection) {
                connection.rollback(function () {
                    connection.release();
                    console.log('transaction rollback!');
                });
            }

            if (err_msg) {
                console.log(err_msg);
            }
            done(err_msg, null);
        });
};
