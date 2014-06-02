var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/coding');

mongoose.connection.on('error', function (err) {
	console.log(err);
});

mongoose.connection.once('open', function (){
	console.log('Database connection established.');
});

require('./model/user');
require('./model/api');
require('./model/example');
require('./model/discussion');