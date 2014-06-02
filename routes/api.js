var mongoose = require('mongoose');
var Api = mongoose.model('Api');

exports.list = function(req, res){
	Api.find().populate('Needs').populate('Examples').exec(function (err, apis, count){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({apis: apis});
	})
};

exports.create = function(req, res){
	var api = new Api(req.body);

	api.save(function (err, newApi){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json(newApi);
		//res.redirect('/');
	})
};


exports.show = function(req, res){
	Api.find({"Language": req.query.Language}).populate('Needs').populate('Examples').exec(function (err, apis){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({apis: apis});
	})
};

exports.showOne = function(req, res){
	Api.findById(req.query.id).populate('Needs').populate('Examples').exec(function (err, api){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json(api);
	})
};

exports.update = function(req, res){
	Api.findById(req.body.id,function (err, api){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}

		api.Language = req.body.Language;
		api.Introduction = req.body.Introduction;
		api.FunctionName = req.body.FunctionName;
		api.Parameter = req.body.Parameter;
		api.ReturnValue = req.body.ReturnValue;
		api.SeeAlso = req.body.SeeAlso;
		api.Compatibility = req.body.Compatibility;

		api.save(function (err, newApi){
			if (err) {
				console.log(err);
				res.json({error: err.name}, 500);
			}
			res.json(newApi);
		})
	})
};

exports.destroy = function(req, res){
	Api.findById(req.body.id,function (err, api){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}

		api.remove(function (err, removeApi){
			if (err) {
				console.log(err);
				res.json({error: err.name}, 500);
			}
			res.json(removeApi);
		})
	})
};

exports.search = function(req, res){
	Api.find({"FunctionName": new RegExp(req.query.keyword), "Language": req.query.Language}).populate('Needs').populate('Examples').exec( function (err, apis, count){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({apis: apis});
	})
};

exports.need = function(req, res){
	Api.findById(req.body.id,function (err, api){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		console.log(api);
		var i = 0;
		var flag = 0;
		for (i = 0; i < api.Needs.length; i++) {
			if (api.Needs[i].toString() === req.body.user.toString()) {
				flag = 1;
			}
		}
		if (flag === 1) {
			res.json({error: "already needed"}, 500);
		}else{
			api.Needs.push(req.body.user);
			api.NeedNumber ++ ;
			api.save(function (err, newapi){
				if (err) {
					console.log(err);
					res.json(500, {error: err.name});
				}
				res.json(newapi);
			})
		}
	})
};

exports.hasneeded = function(req, res){
	console.log("ID: " + req.query.id + " User: " + req.query.user);
	Api.findById(req.query.id,function (err, api){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		console.log(api);
		var i = 0;
		var flag = 0;
		for (i = 0; i < api.Needs.length; i++) {
			if (api.Needs[i].toString() === req.query.user.toString()) {
				flag = 1;
			}
		}
		if (flag === 1) {
			res.json({"hasneeded": true});
		}else{
			res.json({"hasneeded": false});
		}
	})
};

exports.unneed = function(req, res){
	Api.findById(req.body.id,function (err, api){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		console.log(api);
		var i = 0;
		var flag = 0;
		for (i = 0; i < api.Needs.length; i++) {
			if (api.Needs[i].toString() === req.body.user.toString()) {
				flag = 1;
				break;
			}
		}
		if (flag === 0) {
			res.json({error: "haven't needed"}, 500);
		}else{
			api.Needs.splice(i, 1);
			api.NeedNumber -- ;
			api.save(function (err, newapi){
				if (err) {
					console.log(err);
					res.json({error: err.name}, 500);
				}
				res.json(newapi);
			})
		}
	})
};

exports.showTheHighestNeeded = function(req, res){
	Api.find({"Language": req.query.Language}).populate('Needs').sort({'NeedNumber': -1}).limit(req.query.limit).exec(function (err, examples){
		if (err) {
			console.log(err);
			res.json({error: err.name}, 500);
		}
		res.json({examples: examples});
	})
};