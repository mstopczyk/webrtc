// based on http://pixelhandler.com/posts/develop-a-restful-api-using-nodejs-with-express-and-mongoose
// http://synthmedia.co.uk/blog/basic-nodejs-api-with-restify-and-save#.U3HaaXV53IA
mongoose = require('mongoose');

// Database
mongoose.connect('mongodb://localhost/test');

// create schema and model
var Schema = mongoose.Schema;  
var User = new Schema({  
    user_id: { type: String, required: true },  
    user_name: { type: String, unique: true },  
    user_creation_date: { type: Date, default: Date.now },
    user_last_activity_date: { type: Date, required: true }
});

var UserModel = mongoose.model('User', User);  

// create a server
var restify = require('restify'),
    server = restify.createServer({
        name: 'JoinOut Rest'
    });
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

//setup cors
restify.CORS.ALLOW_HEADERS.push('accept');
restify.CORS.ALLOW_HEADERS.push('sid');
restify.CORS.ALLOW_HEADERS.push('lang');
restify.CORS.ALLOW_HEADERS.push('origin');
restify.CORS.ALLOW_HEADERS.push('withcredentials');
restify.CORS.ALLOW_HEADERS.push('x-requested-with');
server.use(restify.CORS());
server.use(restify.fullResponse());
function unknownMethodHandler(req, res) {
  if (req.method.toLowerCase() === 'options') {
      console.log('received an options method request');
    var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With']; // added Origin & X-Requested-With

    if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', res.methods.join(', '));
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    return res.send(204);
  }
  else
    return res.send(new restify.MethodNotAllowedError());
}
server.on('MethodNotAllowed', unknownMethodHandler);


// GET a List of Users
// curl http://localhost:8080/users
server.get('/users', function (req, res){
  return UserModel.find(function (err, products) {
    if (!err) {
      return res.send(products);
    } else {
      return console.log(err);
    }
  });
});


// CREATE a Single User
// curl -i -X POST  http://localhost:8080/users -d '{ "user_name":"John Rabmo", "user_id":"997" }'
server.post('/users', function (req, res){
  var product;
  var json = JSON.parse(req.body);

  product = new UserModel({
    user_id:json.user_id,
    user_name:json.user_name,
    user_last_activity_date:new Date()
  });
  product.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(product);
});

// UPDATE a Single User (update its last_activity_date)
// curl -i -X PUT  http://193.187.64.99:8080/users/08908808883279562
// other possibility described here: http://mongoosejs.com/docs/2.7.x/docs/updating-documents.html
server.put('/users/:id', function (req, res){
        UserModel.findOne({ user_id:req.params.id }, function (err, user){
          user.user_last_activity_date = new Date() ;
          user.save(function (err) {
                if (!err) {
                  return console.log("updated");
                } else {
                  return console.log(err);
                }
          });
        });
  return res.send("200 OK");
});


server.listen(8080);
console.log('Starting Restify on port: 8080');
