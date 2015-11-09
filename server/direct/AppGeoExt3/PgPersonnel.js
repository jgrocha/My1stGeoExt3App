var table = 'personnel';

var pg = global.App.postgres;
var pgcfg = global.App.pgcfg;

var dberror = function (text, log, err, callback) {
    console.error(text + ' ' + err.toString() + ' ' + log);
    callback({
        message: {
            text: text,
            detail: err.toString()
        }
    });
    return false;
};

var Personnel = {

    create: function (params, callback) {
        var rows = [].concat( params ); // even if we receive just one object, we create an array with that object
        console.log(rows);
        console.log(rows.length);

        var insertsToDo = rows.length;
        var insertsDone = [];
        var pgclient = null;
        var pgdone = null;

        function insertRow(element, index, array) {
            var fields = [], values = [];
            for (var key in element) {
                switch (key) {
                    case "id":
                        break;
                    default:
                        fields.push(key);
                        values.push(element[key]);
                        break;
                }
            }
            var i = 0, buracos = [];
            for (i = 1; i <= fields.length; i++) {
                buracos.push('$' + i);
            }
            var sql = `INSERT INTO ${table} (${fields.join()}) VALUES (${buracos.join()}) RETURNING id`;
            console.log(sql);
            pgclient.query(sql, values, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql} Values: ${values.toString()}`, err, callback);
                var id = result.rows[0].id;
                insertsDone.push(id);
                finish();
            });
        }

        function finish() {
            if (insertsToDo == insertsDone.length) {
                console.log('Done!');
                sql = `SELECT * FROM ${table} where id IN (${insertsDone.toString()})`;
                console.log(sql);
                pgclient.query(sql, function (err, result) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                    console.log(result.rows);
                    callback(null, {
                        data: result.rows,
                        total: result.rows.length
                    });
                    pgdone();
                });
            } else {
                console.log('Not yet... ' + insertsDone.length + ' de ' + insertsToDo);
            }
        }

        pg.connect(global.App.connection, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            pgclient = client;
            pgdone = done;
            rows.forEach(insertRow);
        });
    },

    //callback as last argument is mandatory
    read: function (params, callback) {
        var sql = 'SELECT * FROM ' + table,
            where = '';
        //filtering. this example assumes filtering on 1 field, as multiple field where clause requires additional info e.g. chain operator
        if (params.filter) {
            where = " WHERE " + params.filter[0].property + " LIKE '%" + params.filter[0].value + "%'"; // set your business logic here to perform advanced where clause
            sql += where;
        }
        // this sample implementation supports 1 sorter, to have more than one, you have to loop and alter query
        if (params.sort) {
            var s = params.sort[0];
            sql = sql + ' ORDER BY "' + s.property + '" ' + s.direction;
        }
        pg.connect(global.App.connection, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                callback(null, {
                    data: result.rows,
                    total: result.rows.length
                });
                // free this client, from the client pool
                done();
            });
        });
    },

    update: function (params, callback) {
        /*
         { email: 'adele_singer@gmail.com', id: 7 }
         * it can have more than one record to update:
         * [ { name: 'Ana', id: 7 },
         { email: 'adele_singer@gmail.com', id: 8 } ]
         */

        var rows = [].concat( params ); // even if we receive just one object, we create an array with that object
        console.log(rows);
        console.log(rows.length);

        var updatesToDo = rows.length;
        var updatesDone = [];
        var pgclient = null;
        var pgdone = null;

        function updateRow(element, index, array) {
            var i = 1, id, fields = [], values = [];
            id = element.id;
            delete element.id;
            for (var key in element) {
                fields.push(key + '= $' + i);
                values.push(element[key]);
                i = i + 1;
            }
            var sql = `UPDATE ${table} SET ${fields.join()} WHERE id = ${id}`;
            console.log(sql);
            pgclient.query(sql, values, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql} Values: ${values.toString()}`, err, callback);
                console.log('Rows updated: ' + result.rowCount);
                if (result.rowCount != updatesToDo) {
                    console.error('Error: only ' + result.rowCount + ' rows of ' + updatesToDo + ' were updated');
                }
                updatesDone.push(id);
                finish();
            });
        }

        function finish() {
            if (updatesToDo == updatesDone.length) {
                console.log('Done!');
                sql = `SELECT * FROM ${table} where id IN (${updatesDone.toString()})`;
                console.log(sql);
                pgclient.query(sql, function (err, result) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                    console.log(result.rows);
                    callback(null, {
                        data: result.rows,
                        total: result.rows.length
                    });
                    pgdone();
                });
            } else {
                console.log('Not yet... ' + updatesDone.length + ' de ' + updatesToDo);
            }
        }
        pg.connect(global.App.connection, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            pgclient = client;
            pgdone = done;
            rows.forEach(updateRow);
        });
    },

    destroy: function (params, callback) {
        //  { id: 30 }
        //  [ { id: 30 }, { id: 31 }, { id: 71 }, { id: 74 } ]
        var rows = [].concat( params ); // even if we receive just one object, we create an array with that object
        console.log(rows);
        console.log(rows.length);
        var ids = rows.reduce(function(previousValue, currentValue, index, array) {
            return previousValue.concat(currentValue['id']);
        }, []);
        console.log(ids);
        var sql = `DELETE FROM ${table} WHERE id IN (${ids.toString()})`;
        console.log(sql);
        pg.connect(global.App.connection, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                console.log(result.rowCount);
                if (result.rowCount != rows.length) {
                    console.error('Error: only ' + result.rowCount + ' rows of ' + rows.length + ' were deleted');
                }
                callback(null, {});
                // free this client, from the client pool
                done();
            });
        });
    }

};

module.exports = Personnel;