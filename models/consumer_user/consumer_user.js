exports.consumer_user_basic = {
    insert: 'INSERT INTO consumer_user_basic SET ?',

    update: 'UPDATE consumer_user_basic SET ? WHERE ?',
    update_and: 'UPDATE consumer_user_basic SET ? WHERE ? AND ?',

    delete: 'DELETE FROM consumer_user_basic WHERE ?',

    select: 'SELECT * FROM consumer_user_basic where ?',
    select_in: 'SELECT * FROM consumer_user_basic WHERE (??) IN (?)',
    select_all: 'SELECT * FROM consumer_user_basic',
    select_and: 'SELECT * FROM consumer_user_basic WHERE ? AND ?',
    select_distinct_where_ue: 'SELECT distinct ?? FROM consumer_user_basic where ?? <> ?',
    select_regexp_limit: 'SELECT * FROM consumer_user_basic WHERE ?? REGEXP ? LIMIT ?',
    select_count_as_where_ge_and_le: 'SELECT count(*) AS ?? FROM consumer_user_basic WHERE ?? >= ? AND ?? <= ?',
    select_in_or_regexp_limit: 'SELECT * FROM consumer_user_basic WHERE (??) IN (?) OR ?? REGEXP ? LIMIT ?',

    // mgmt Search
    select_count_as_all: 'SELECT COUNT(*) AS ?? FROM consumer_user_basic',
    select_count_as_where_in: 'SELECT COUNT(*) AS ?? FROM consumer_user_basic WHERE (??) IN (?)',
    select_left_order_by_limit: 'SELECT CUB.*, UB.consumer_account_status ' +
    'FROM consumer_user_basic AS CUB ' +
    'LEFT JOIN user_basic AS UB ON UB.user_id=CUB.user_id ' +
    'ORDER BY (??) DESC ' +
    'LIMIT ?',

    select_left_in_order_by_limit: 'SELECT CUB.*, UB.consumer_account_status ' +
    'FROM consumer_user_basic AS CUB ' +
    'LEFT JOIN user_basic AS UB ON UB.user_id=CUB.user_id ' +
    'WHERE (CUB.??) IN (?) ' +
    'ORDER BY (??) DESC ' +
    'LIMIT ?'
};