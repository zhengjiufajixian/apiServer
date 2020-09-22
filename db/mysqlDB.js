let mysql = require('mysql');

let config = require('../config/sys_config.js');

/*************************** Init Connection ***************************/
let projectDB = {
    pool_cluster: null,
    hasReadonlyDB: false
};

exports.connect = function () {
    let pool_cluster = mysql.createPoolCluster();

    // Create master pool
    pool_cluster.add('MASTER', config.mysqldb_config);
    console.log('MySQL connection to: ' + config.mysqldb_config.host);

    // Create slave pool cluster
    let slave_added = 0;
    let slave_removed = 0;
    let mysqldb_readonly_config = config.mysqldb_readonly_config;

    if (mysqldb_readonly_config && mysqldb_readonly_config.length > 0) {
        for (let index in mysqldb_readonly_config) {
            // eslint-disable-next-line no-prototype-builtins
            if (mysqldb_readonly_config.hasOwnProperty(index)) {
                let slave_name = 'SLAVE' + parseInt(index + 1);
                pool_cluster.add(slave_name, mysqldb_readonly_config[index]);
                slave_added++;
                console.log('Readonly MySQL connection to: ' + mysqldb_readonly_config[index].host);
            }
        }
        projectDB.hasReadonlyDB = true;
    }

    // if slave node is removed
    // count and turn off read only db when slave_removed == slave_added
    pool_cluster.on('remove', function (nodeId) {
        console.log('Removed MySQL node : ' + nodeId);
        slave_removed++;

        if (slave_removed === slave_added) {
            projectDB.hasReadonlyDB = false;
        }
    });

    projectDB.pool_cluster = pool_cluster;
};

/*************************** End Connection Gracefully ***************************/
exports.end = function (done) {
    if (!projectDB.pool_cluster) {
        console.log('end: Missing database connection.');
        return done(new Error('end: Missing database connection.'), null);
    }

    projectDB.pool_cluster.end(function (error) {
        if (error) {
            console.log('end:' + error);
            return done(new Error('end:' + error), null);
        }
        done(null, null);
    });
};

/*************************** Get Connection from Master DB***************************/
function getConnection(done) {
    if (!projectDB.pool_cluster) {
        console.log('getConnection: Missing database connection.');
        return done(new Error('getConnection: Missing database connection.'), null);
    }

    projectDB.pool_cluster.getConnection('MASTER', function (error, connection) {
        if (error) {
            console.log('getConnection:' + error);
            return done(new Error('getConnection:' + error), null);
        }
        return done(null, connection);
    });
}

exports.getConnection = getConnection;

/*************************** Get Connection from Readonly Slave DB ***************************/
function getROConnection(done) {
    if (!projectDB.hasReadonlyDB) {
        return getConnection(done);
    }

    projectDB.pool_cluster.getConnection('SLAVE*', 'RANDOM', function (error, connection) {
        if (error) {
            console.log('getROConnection:' + error);
            return done(new Error('getROConnection:' + error), null);
        }
        return done(null, connection);
    });
}

exports.getROConnection = getROConnection;

/*************************** Query Execution Master DB ***************************/
function query_master(statement, statement_op, done) {
    getConnection(function (error, connection) {
        if (error) {
            console.log('query_master:' + error);
            return done(new Error('query_master:' + error), null);
        }

        let query = connection.query(statement, statement_op, function (error, rows) {
            connection.release();
            if (error) {
                console.log('query_master: ' + error);
                console.log('connection.sql: ' + query.sql);
                return done(new Error('query_master: ' + error), null);
            }
            return done(null, rows);
        });
    });
}

exports.query_master = query_master;

/*************************** Query Execution Readonly Slave DB ***************************/
exports.query = function (statement, statement_op, done) {

    //not read only, redirect to master
    if (statement.substring(0, 6).toUpperCase() !== 'SELECT') {
        return query_master(statement, statement_op, done);
    }

    getROConnection(function (error, connection) {
        //turn off readonly slave if error
        if (error) {
            projectDB.hasReadonlyDB = false;
            console.log('query: ' + error);
            return done(new Error('query: ' + error), null);
        }

        let query = connection.query(statement, statement_op, function (error, rows) {
            connection.release();
            if (error) {
                console.log('query: ' + error);
                console.log('connection.sql: ' + query.sql);
                return done(new Error('query: ' + error), null);
            }
            return done(null, rows);
        });
    });
};
