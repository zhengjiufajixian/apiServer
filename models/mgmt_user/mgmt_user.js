
exports.mgmt_user_basic = {
    insert: 'INSERT INTO mgmt_user_basic SET ?',

    delete: 'DELETE FROM mgmt_user_basic WHERE ?',

    update: 'UPDATE mgmt_user_basic SET ? WHERE ?',

    select: 'SELECT * FROM mgmt_user_basic WHERE ?',
    select_in: 'SELECT * FROM mgmt_user_basic WHERE (??) IN (?)',
    select_all: 'SELECT * FROM mgmt_user_basic',
    select_and: 'SELECT * FROM mgmt_user_basic WHERE ? AND ?',
    select_and_ne: 'SELECT * FROM mgmt_user_basic WHERE ? AND ?? <> ?',
    select_where_and_le: 'SELECT * FROM mgmt_user_basic WHERE ? AND ?? <= ?',

    // mgmt auth check
    select_where_and_in: 'SELECT * FROM mgmt_user_basic WHERE ? AND ?? IN (?)',

    // mgmt Search
    select_count_as_all: 'SELECT COUNT(*) AS ?? FROM mgmt_user_basic',
    select_count_as_where_in: 'SELECT COUNT(*) AS ?? FROM mgmt_user_basic WHERE (??) IN (?)',
    select_order_by_limit: 'SELECT * FROM mgmt_user_basic ORDER BY (??) DESC LIMIT ?',
    select_in_order_by_limit: 'SELECT * FROM mgmt_user_basic WHERE (??) IN (?) ORDER BY (??) DESC LIMIT ?'
};