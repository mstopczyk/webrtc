0. Install MongoDB

1. Copy file into a directory 
2. Run in the directory with server.js
npm install restify
npm install mongodb
npm install monk
npm install mongoose
npm install express

3. Start app 'node server.js'


===============

Testing MongoDB
>> mongo
>> db.test.save( { a: 1 } )
>> db.test.find()


db.usercollection.insert({ "username" : "testuser1", "email" : "testuser1@testdomain.com" })
newstuff = [{ "username" : "testuser2", "email" : "testuser2@testdomain.com" }, { "username" : "testuser3", "email" : "testuser3@testdomain.com" }]
db.usercollection.insert(newstuff);

db.usercollection.find().pretty()
===================================

clear MongoDB Collection

db.getCollection("users").drop()


=================
CURL

# GET a List of Users
curl http://localhost:8080/users

# CREATE a Single User
curl -i -X POST  http://localhost:8080/users -d '{ "user_name":"John Rabmo", "user_id":"997" }'



# testing
curl -is -X POST -H "Content-Type: application/json" -d '{ "name":"John", "a":"b" }' http://127.0.0.1:8080/user
