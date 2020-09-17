global.hostname = 'localhost';
global.port = '27017';

const oldCollection = require('./oldUser');
const newCollection = require('./newUser');
const c = require('./database')(global.hostname, global.port, 'list');
const uuidv1 = require('uuid/v1');

c.then((conn) => {
    const { generateSalt, encodePassword } = require('./cryptomw');

    const defaultPreferences = {
        gui: {
            theme: 'dark',
            language: 'en-US',
        },
        analysis: {
            currentProfileId: null,
        },
        gdprData: {
            gdprAccepted: false,
            collectMetrics: false,
        },
        news: {
            last_news_id: null,
        },
    };

    async function migrate() {
        const users = await oldCollection.find({}).exec();
        if (users === null) return null;

        const newUsers = users.map(async (user) => {
            let newUser = {};
            newUser.username = user.email;
            newUser.salt = generateSalt();
            newUser.password = encodePassword(user.email, newUser.salt);
            newUser.preferences = defaultPreferences;
            newUser.id = user._id;
            newUser.preferences.analysis.currentProfileId = user.preferences.analysis.currentProfileId;
            newUser.preferences.gui = user.preferences.gui;

            newCollection
                .create(newUser)
                .then(function (data) {
                    console.log(
                        `User ${newUser.username} created in the new format. Username was used as the new password. `
                    );
                })
                .catch(function (err) {
                    console.log(err.message);
                });
        });
        await Promise.all(newUsers);

        const backupCollectionName = `users_${uuidv1()}`;
        await conn.collection('users').rename(backupCollectionName, { dropTarget: true });
		console.log(`Users collection backed up to ${backupCollectionName}`);

        await conn.collection('usersv2').rename('users', { dropTarget: true });
    }

    migrate();
}).catch((err) => {
    console.log(err);
});
