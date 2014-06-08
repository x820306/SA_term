var mongoose = require('mongoose');
var Example = mongoose.model('Example');
var Api = mongoose.model('Api');
var sanitizer = require('sanitizer');

exports.list = function(req, res){
	Example.find().populate('CreatedBy').populate('Likes').populate('Discussions').populate('ApiID').exec(function (err, examples, count){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({examples: examples});
	})
};

exports.create = function(req, res){
	var example = new Example();
	example.Description = sanitizer.sanitize(req.body.Description);
	example.Code = sanitizer.sanitize(req.body.Code);
	example.Output = sanitizer.sanitize(req.body.Output);
	example.CreatedBy = req.body.CreatedBy;
	example.ApiID = req.body.ApiID;

	example.save(function (err, newexample){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}

		Api.findById(req.body.ApiID).exec(function (err, api){
			if (err) {
				console.log(err);
				res.json({error: err.name}, 500);
			}

			api.Examples.push(newexample._id);

			api.save(function (err, updatedapi){
				if (err) {
					console.log(err);
					res.json({error: err.name}, 500);
				}
				res.json(newexample);

			});
		})
	})
};

exports.showTheHighestRanking = function(req, res){
	Example.find({"ApiID": req.query.apiid}).populate('CreatedBy').populate('Likes').sort({'LikeNumber': -1}).limit(req.query.limit).exec(function (err, examples){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({examples: examples});
	})
};

exports.show = function(req, res){
	Example.find({"ApiID": req.query.apiid}).populate('CreatedBy').populate('Likes').populate('Discussions').sort({'LikeNumber': -1}).exec(function (err, examples){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({examples: examples});
	})
};

exports.showAllExamplesByUser = function(req, res){
	Example.find({"CreatedBy": req.query.id}).populate('Likes').populate('Discussions').exec(function (err, examples){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({examples: examples});
	})
};

exports.update = function(req, res){
	Example.findById(req.body.id,function (err, example){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		console.log(example);
		example.Description = sanitizer.sanitize(req.body.Description);
		example.Code = sanitizer.sanitize(req.body.Code);
		example.Output = sanitizer.sanitize(req.body.Output);
		example.UpdatedAt = Date.now();
		example.save(function (err, newexample){
			if (err) {
				console.log(err);
				res.json({error: err.name}, 500);
			}
			res.json(newexample);
		})
	})
};

exports.like = function(req, res){
	Example.findById(req.body.id,function (err, example){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		console.log(example);
		var i = 0;
		var flag = 0;
		for (i = 0; i < example.Likes.length; i++) {
			if (example.Likes[i].toString() === req.body.user.toString()) {
				flag = 1;
			}
		}
		if (flag === 1) {
			res.json({error: "already liked"}, 500);
		}else{
			example.Likes.push(req.body.user);
			example.LikeNumber ++ ;
			example.save(function (err, newexample){
				if (err) {
					console.log(err);
					res.json(500, {error: err.name});
				}
				res.json(newexample);
			})
		}
	})
};

exports.hasliked = function(req, res){
	console.log("ID: " + req.query.id + " User: " + req.query.user);
	Example.findById(req.query.id,function (err, example){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		console.log(example);
		var i = 0;
		var flag = 0;
		for (i = 0; i < example.Likes.length; i++) {
			if (example.Likes[i].toString() === req.query.user.toString()) {
				flag = 1;
			}
		}
		if (flag === 1) {
			res.json({"hasliked": true});
		}else{
			res.json({"hasliked": false});
		}
	})
};

exports.unlike = function(req, res){
	Example.findById(req.body.id,function (err, example){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		console.log(example);
		var i = 0;
		var flag = 0;
		for (i = 0; i < example.Likes.length; i++) {
			if (example.Likes[i].toString() === req.body.user.toString()) {
				flag = 1;
				break;
			}
		}
		if (flag === 0) {
			res.json({error: "haven't liked"}, 500);
		}else{
			example.Likes.splice(i, 1);
			example.LikeNumber -- ;
			example.save(function (err, newexample){
				if (err) {
					console.log(err);
					res.json({error: err.name}, 500);
				}
				res.json(newexample);
			})
		}
	})
};

exports.destroy = function(req, res){
	Example.findById(req.body.id,function (err, example){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		Api.findById(example.ApiID).exec(function (err, api){
			if (err) {
				console.log(err);
				res.json({error: err.name}, 500);
			}
			var i = 0;
			for (i = 0; i < api.Examples.length; i++) {
				if (api.Examples[i].toString() === example._id.toString()) {
					console.log("found");
					break;
				}
			};
			api.Examples.splice(i, 1);

			api.save(function (err, updatedapi){
				if (err) {
					console.log(err);
					res.json({error: err.name}, 500);
				}
				example.remove(function (err, removeexample){
							if (err) {
								console.log(err);
								res.json({error: err.name}, 500);
							}
							res.json(removeexample);
						})

			});
		})
		
	})
};

