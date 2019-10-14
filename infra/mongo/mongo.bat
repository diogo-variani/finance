@REM ##########################################################################
@REM Initial setup. It configures the main users that will access the database.
@REM ##########################################################################
mongod --dbpath=C:\LocalUserPrivateData\mongodb\sample --port 27017
mongo --port 27017 C:\LocalUserPrivateData\repositories\private\finance\infra\mongo-create-users.js



@REM ##########################################################################
@REM Populate the database based on the seed files.
@REM ##########################################################################

#mongod --dbpath C:\LocalUserPrivateData\mongodb\sample --port 27017 --auth --outputConfig
mongod --config C:\LocalUserPrivateData\repositories\private\finance\infra\mongo\mongo-dev.conf

#Seed
mongo --port 27017 C:\LocalUserPrivateData\repositories\private\finance\infra\mongo\mongo-categories-seed.js
mongo --port 27017 C:\LocalUserPrivateData\repositories\private\finance\infra\mongo\mongo-bank-account-seed.js
mongo --port 27017 C:\LocalUserPrivateData\repositories\private\finance\infra\mongo\mongo-credit-card-seed.js
mongo --port 27017 C:\LocalUserPrivateData\repositories\private\finance\infra\mongo\mongo-movements-seed.js