mongod --dbpath=C:\LocalUserPrivateData\mongodb\sample --port 27017
mongo --port 27017 C:\LocalUserPrivateData\repositories\private\finance\infra\mongo-create-users.js

#mongod --dbpath C:\LocalUserPrivateData\mongodb\sample --port 27017 --auth --outputConfig
mongod --config C:\LocalUserPrivateData\repositories\private\finance\infra\mongo-dev.conf

#Seed
mongo --port 27017 C:\LocalUserPrivateData\repositories\private\finance\infra\mongo-seed.js