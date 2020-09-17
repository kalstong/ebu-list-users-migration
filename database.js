const mongoose = require('mongoose');

function createNewConnection(databaseHostname, databasePort, databaseName) {
    const mongoDatabaseUrl = `mongodb://${databaseHostname}:${databasePort}/${databaseName}`;
    console.log(`Creating a connection to ${mongoDatabaseUrl}.`);

    const options = {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    const conn = mongoose.createConnection(mongoDatabaseUrl, options);

    conn.then(
        (connection) => {
            console.log('Connected to DB.');
            return connection;
        },
        (err) => {
            console.log('Failed to create a connection to DB. Exiting.');

            process.exit(-1);
        }
    );

    return conn;
}

let databases_ = new Map();

module.exports = (hostname, port, databaseName) => {
    if (!databases_.has(databaseName)) {
        databases_.set(databaseName, createNewConnection(hostname, port, databaseName));
    }

    return databases_.get(databaseName);
};
