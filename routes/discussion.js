var mongoose = require('mongoose');
var Discussion = mongoose.model('Discussion');
var Example = mongoose.model('Example');
var sanitizer = require('sanitizer');

exports.list = function(req, res){
	Discussion.find().populate('CreatedBy').populate('ExampleID').sort({"CreatedAt": 1}).exec(function (err, discussions, count){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({discussions: discussions});
	})
};

exports.create = function(req, res){
	var discussion = new Discussion();
	discussion.Content = sanitizer.sanitize(req.body.Content);
	discussion.ExampleID =sanitizer.sanitize(req.body.ExampleID);
	discussion.CreatedBy = sanitizer.sanitize(req.body.CreatedBy);

	discussion.save(function (err, newdiscussion){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}

		Example.findById(req.body.ExampleID).exec(function (err, example){
			if (err) {
				console.log(err);
				res.json({error: err.name}, 500);
			}

			example.Discussions.push(newdiscussion._id);

			example.save(function (err, updatedexample){
				if (err) {
					console.log(err);
					res.json({error: err.name}, 500);
				}
				res.json(newdiscussion);

			});
		})

		
	})

	
};


exports.show = function(req, res){
	Discussion.find({"ExampleID": req.query.exampleid}).populate('CreatedBy').populate('ExampleID').sort({"CreatedAt": 1}).exec(function (err, discussions){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({discussions: discussions});
	})
};

exports.update = function(req, res){
	Discussion.findById(req.body.id,function (err, discussion){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		console.log(discussion);
		discussion.Content = sanitizer.sanitize(req.body.Content);;
		discussion.UpdatedAt = Date.now();
		discussion.save(function (err, newdiscussion){
			if (err) {
				console.log(err);
				res.json({error: err.name}, 500);
			}
			res.json(newdiscussion);
		})
	})
};

exports.destroy = function(req, res){
	Discussion.findById(req.body.id,function (err, discussion){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		Example.findById(discussion.ExampleID).exec(function (err, example){
			if (err) {
				console.log(err);
				res.json({error: err.name}, 500);
			}
			var i = 0;
			for (i = 0; i < example.Discussions.length; i++) {
				if (example.Discussions[i].toString() === discussion._id.toString()) {
					console.log("found");
					break;
				}
			};
			example.Discussions.splice(i, 1);

			example.save(function (err, updatedexample){
				if (err) {
					console.log(err);
					res.json({error: err.name}, 500);
				}
				discussion.remove(function (err, removediscussion){
							if (err) {
								console.log(err);
								res.json({error: err.name}, 500);
							}
							res.json(removediscussion);
						})

			});
		})
		
	})
};
