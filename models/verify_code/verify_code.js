// action(select)_condition(orderby, where)_logical(and, or,limit, union, union_all)
// select_orderby_limit, select_where_and, select_where_union

/*************************** Prepared statement ***************************/
exports.verify_code = {
    insert: 'INSERT INTO verify_code SET ?',
    update: 'UPDATE verify_code SET ? WHERE ?',

    // verify_code check
    select_in_order_by_desc_Limit: 'SELECT * FROM verify_code WHERE (??) IN (?) ORDER BY ?? DESC LIMIT ?',

    // mgmt Search
    select_count_as_all: 'SELECT COUNT(*) AS ?? FROM verify_code',
    select_count_as_where_in: 'SELECT COUNT(*) AS ?? FROM verify_code WHERE (??) IN (?)',
    select_order_by_limit: 'SELECT * FROM verify_code ORDER BY (??) DESC LIMIT ?',
    select_in_order_by_limit: 'SELECT * FROM verify_code WHERE (??) IN (?) ORDER BY (??) DESC LIMIT ?'
};