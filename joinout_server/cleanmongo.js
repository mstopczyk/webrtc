var last_activity_deadline = new Date()
last_activity_deadline.setMinutes(last_activity_deadline.getMinutes()-15)
var query =  {"user_last_activity_date":{$lt: last_activity_deadline}}
db.getCollection("users").remove(query);
