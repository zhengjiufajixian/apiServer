exports.user_basic = {
    insert: 'INSERT INTO user_basic SET ?',
    update: 'UPDATE user_basic SET ? WHERE ?',
    update_and: 'UPDATE user_basic SET ? WHERE ? AND ?',
    delete: 'DELETE FROM user_basic WHERE ?',

    select_all: 'SELECT * FROM user_basic',
    select_in: 'SELECT * FROM user_basic WHERE (??) IN (?)',
    select_limit: 'SELECT * FROM user_basic LIMIT ?',
    select_in_limit: 'SELECT * FROM user_basic WHERE (??) IN (?) LIMIT ?',
    select_distinct_where_ue: 'SELECT distinct ?? FROM user_basic',
    select_regexp_limit: 'SELECT * FROM user_basic WHERE ?? REGEXP ? LIMIT ?',
    select_in_or_regexp_limit: 'SELECT * FROM user_basic WHERE (??) IN (?) OR ?? REGEXP ? LIMIT ?',

    select: 'SELECT * FROM user_basic where ?',
    select_and: 'SELECT * FROM user_basic WHERE ? AND ?',

    // mgmt Search
    select_count_as_all: 'SELECT COUNT(*) AS ?? FROM user_basic',
    select_count_as_where_in: 'SELECT COUNT(*) AS ?? FROM user_basic WHERE (??) IN (?)',
    select_order_by_limit: 'SELECT * FROM user_basic ORDER BY (??) DESC LIMIT ?',
    select_in_order_by_limit: 'SELECT * FROM user_basic WHERE (??) IN (?) ORDER BY (??) DESC LIMIT ?'
};