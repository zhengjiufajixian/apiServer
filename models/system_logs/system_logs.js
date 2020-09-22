'use strict';

exports.api_log = {
    insert: 'INSERT INTO api_log SET ?',

    // mgmt searchAPILog
    select_count_as_all: 'SELECT COUNT(*) AS ?? FROM api_log',
    select_count_as_where_in: 'SELECT COUNT(*) AS ?? FROM api_log WHERE (??) IN (?)',
    select_order_by_limit: 'SELECT * FROM api_log ORDER BY (??) DESC LIMIT ?',
    select_in_order_by_limit: 'SELECT * FROM api_log WHERE (??) IN (?) ORDER BY (??) DESC LIMIT ?'
};

exports.user_register_log = {
    insert: 'INSERT INTO user_register_log SET ?',

    // mgmt getRegisterStat
    select_count_as_where_ge_and_le: 'SELECT count(*) AS ?? FROM user_register_log WHERE ?? >= ? AND ?? <= ?',

    // mgmt searchUserRegisterLog
    select_count_as_all: 'SELECT COUNT(*) AS ?? FROM user_register_log',
    select_count_as_where_in: 'SELECT COUNT(*) AS ?? FROM user_register_log WHERE (??) IN (?)',
    select_order_by_limit: 'SELECT * FROM user_register_log ORDER BY (??) DESC LIMIT ?',
    select_in_order_by_limit: 'SELECT * FROM user_register_log WHERE (??) IN (?) ORDER BY (??) DESC LIMIT ?'
};