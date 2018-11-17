var config = require('./../config.js');
var pg = require('pg');

var check_exist_table_cache = {
    text: 'CREATE TABLE IF NOT EXISTS mycache (id NUMERIC PRIMARY KEY, mycacheobject JSON)'
};

module.exports.saveCacheInDb = async (cacheobject) => {
    var client = new pg.Client({
        connectionString: config.db_uri,
    });

    client.on('error', (err, client) => {
        console.error('\n\nОшибка в обращении к базе данных:\n   ' + err);
    });

    client.connect();

    client.query(check_exist_table_cache)
        .catch(err => {
            client.end();
            console.error(`\nОшибка при создании таблицы кэша:\n   ${err}`);
        });

    try {
        await client.query('INSERT INTO mycache (id, mycacheobject) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET mycacheobject = $1', [cacheobject]);
    } catch (err) {
        console.error(`\nОшибка при сохранении кэша:\n   ${err}`);
    } finally {
        client.end();
    };
};

module.exports.loadCacheFromDb = async () => {
    var client = new pg.Client({
        connectionString: config.db_uri,
    });

    client.on('error', (err, client) => {
        console.error('\n\nОшибка в обращении к базе данных:\n   ' + err);
    });

    client.connect();

    client.query(check_exist_table_cache)
        .catch(err => {
            client.end();
            console.error(`\nОшибка при создании таблицы кэша:\n   ${err}`);
        });

    try {
        var result = await client.query('SELECT mycacheobject FROM mycache WHERE id = 1');
        return result;
    } catch (err) {
        console.error(`\nОшибка при выполнении запроса:\n   ${err}`);
    } finally {
        client.end();
    };
};