var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.findOne = function(req, detail, cb){
	console.log(req.Identifier);
	User.findOne({'Identifier': req.Identifier}, function(err, user){
		if (err) {
			console.log("err");
			cb({error: err.name}, 500);
		}
		console.log(user);
		if (user) {
			console.log("found!");
			cb(err, JSON.stringify(user));
		}else{
			console.log("cannot find");
			var newuser = new User();
			newuser.Identifier = detail.Identifier;
			newuser.DisplayName = detail.DisplayName;
			newuser.LoginBy = detail.LoginBy;
			newuser.save(function (err, newUser){
				if (err) {
					console.error(err);
					cb({error: err.name}, 500);
				}
				console.log(newUser);
				cb(err, JSON.stringify(newUser));
			})
		}
	});
}