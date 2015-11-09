/**
 * Created by jgr on 03-11-2015.
 */

var pg = require('pg'),
    cfg = require('./pg-config');

var myfields = ['name', 'email', 'phone'];
var valores = ['Adelaide', 'adelia@gmail.com', '234360101'];
var holes = ['$1', '$2', '$3'];

var sql = `INSERT INTO ppgis.promotor (${myfields.join()}) VALUES (${holes.join()}) RETURNING id`;

console.log(sql);

var a = 5;
var b = 10;

function tag(strings, ...values) {
    console.log(strings[0]); // "Hello "
    console.log(strings[1]); // " world "
    console.log(values[0]);  // 15
    console.log(values[1]);  // 50

    return "Bazinga!";
}

tag`Hello ${ a + b } world ${ a * b}`;

function SQL(parts, ...values) {
    return {
        text: parts.reduce((prev, curr, i) => prev+"$"+i+curr),
        values
    };
}

var userId = 25;
var password = 'tulipa25';

var sql2 = SQL`select name from user where id=${userId} and password=${password}`;
//var sql2 = SQL`INSERT INTO personnel (${myfields.join()}) VALUES (${holes.join()}) RETURNING id`;

console.log(sql2.text);
console.log(sql2.values);

/*
pg.connect(pgcfg.connection, function (err, client, done) {
    client.query('INSERT INTO personnel (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function (err, result) {
        if (err) {
            console.log('Erro na query: ' + sql);
            callback({
                message: {
                    text: 'Database error',
                    sql: sql,
                    debug: err
                }
            });
            return false;
        } else {
            console.log(result.rows);
            callback(null, {
                data: result.rows,
                total: result.rows.length
            });
        }
        // free this client, from the client pool
        done();
    });
});
*/