exports.merchant_user_basic = {
    insert: 'INSERT INTO merchant_user_basic SET ?',

    update: 'UPDATE merchant_user_basic SET ? WHERE ?',
    update_and: 'UPDATE merchant_user_basic SET ? WHERE ? AND ?',

    delete: 'DELETE FROM merchant_user_basic WHERE ?',

    select: 'SELECT * FROM merchant_user_basic where ?',
    select_all: 'SELECT * FROM merchant_user_basic',
    select_and: 'SELECT * FROM merchant_user_basic WHERE ? AND ?',
    select_in: 'SELECT * FROM merchant_user_basic WHERE (??) IN (?)',
    select_distinct_where_ue: 'SELECT distinct ?? FROM merchant_user_basic where ?? <> ?',
    select_regexp_limit: 'SELECT * FROM merchant_user_basic WHERE ?? REGEXP ? LIMIT ?',
    select_count_as_where_ge_and_le: 'SELECT count(*) AS ?? FROM merchant_user_basic WHERE ?? >= ? AND ?? <= ?',
    select_in_or_regexp_limit: 'SELECT * FROM merchant_user_basic WHERE (??) IN (?) OR ?? REGEXP ? LIMIT ?',
    select_order_by_limit: 'SELECT * FROM merchant_user_basic ORDER BY (??) DESC LIMIT ?',
    select_in_order_by_limit: 'SELECT * FROM merchant_user_basic WHERE (??) IN (?) ORDER BY (??) DESC LIMIT ?',

    // client searchMerchantUser
    select_count_as_left3_where_or_and: 'SELECT COUNT(DISTINCT MUB.user_id) AS ?? ' +
    'FROM merchant_user_basic AS MUB ' +
    'LEFT JOIN user_artwork AS UA ON UA.user_id=MUB.user_id ' +
    'LEFT JOIN merchant_user_agreement AS MUA ON MUA.user_id=MUB.user_id ' +
    'LEFT JOIN merchant_catagory AS MC ON MC.merchant_catagory_id=MUA.merchant_catagory_id ' +
    'WHERE (?? LIKE ? OR ?? LIKE ?) ' +
    'AND ? ',
    select_left3_where_or_and_group_order_limit: 'SELECT MUB.* ' +
    'FROM merchant_user_basic AS MUB ' +
    'LEFT JOIN user_artwork AS UA ON UA.user_id=MUB.user_id ' +
    'LEFT JOIN merchant_user_agreement AS MUA ON MUA.user_id=MUB.user_id ' +
    'LEFT JOIN merchant_catagory AS MC ON MC.merchant_catagory_id=MUA.merchant_catagory_id ' +
    'WHERE (?? LIKE ? OR ?? LIKE ?) ' +
    'AND ? ' +
    'GROUP BY MUB.user_id ' +
    'ORDER BY (??) DESC ' +
    'LIMIT ?',

    // mgmt Search
    select_count_as_all: 'SELECT COUNT(*) AS ?? FROM merchant_user_basic',
    select_count_as_where_in: 'SELECT COUNT(*) AS ?? FROM merchant_user_basic WHERE (??) IN (?)',
    select_left_order_by_limit: 'SELECT MUB.*, UB.merchant_account_status ' +
    'FROM merchant_user_basic AS MUB ' +
    'LEFT JOIN user_basic AS UB ON UB.user_id=MUB.user_id ' +
    'ORDER BY (??) DESC ' +
    'LIMIT ?',

    select_left_in_order_by_limit: 'SELECT MUB.*, UB.merchant_account_status ' +
    'FROM merchant_user_basic AS MUB ' +
    'LEFT JOIN user_basic AS UB ON UB.user_id=MUB.user_id ' +
    'WHERE (MUB.??) IN (?) ' +
    'ORDER BY (??) DESC ' +
    'LIMIT ?'
};