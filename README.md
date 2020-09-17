# ebu-list-users-migration
Migrate EBU-LIST users at least from v1.15 to v1.16.4

This scripts are ready to connect to mongodb at 'localhost:27017'
To change, please edit the migrate_users.js and change line 1 and 2.

### How it works

  - Find all users
  - For each user create a new one reseting the password to the email.
    - Save the new user in a separated collection with the name 'usersv2'
  - Backup old users collection 'users' to 'users_GUD'
  - Move 'usersv2' to 'users' collection

Runnig with a already migrated db, will cause a crash. It is possible to recover manually.

### Pre-requirements
- Expose mongo port (editing the ebu-list docker-compose.yml)

### Run
- npm install
- npm start
