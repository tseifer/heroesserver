var Hero = require('../models/heroModel');

//var async = require('async');

exports.getAllHeroes =  async function (req, res, next) {
	try
	{
		const heroes = await Hero.find().exec();
		res.send(heroes);
	} catch (err) {
		console.log('find-all heroes error:' + err);
		return next(err);
	}
}

exports.getHero = async function (req, res, next) {
	req.sanitize('id').trim();
	try
	{
		const hero = await Hero.findById(req.params.id).exec();
		res.send(hero);
	} catch (err) {
		console.log('find hero error:' + err);
		return next(err);
	}
}

exports.addHero = async function (req, res, next) {
	const newHero = req.body;
	console.log(newHero)
	if (!newHero.name)
	{
		res.status(400).json({msg: 'Please include name and email'});
	} else {
		try {
			await Hero.create(newHero);
		} catch(err) {
			console.log('create hero error:' + err);
			return next(err);
		}
		return await exports.getAllHeroes(req, res, next)
	}
}

exports.deleteHero = async function (req, res, next) {
	req.sanitize('id').trim();
	try
	{
		const deletedHero = await Hero.findByIdAndRemove(req.params.id).exec();
		console.log("deleted hero: " + JSON.stringify(deletedHero));
		res.send(deletedHero);
	} catch (err)
	{
		console.log('error deleting hero :' + err);
		return next(err);
	}
}

exports.updateHero = async function(req, res, next) {
	req.sanitize('id').trim();
	try
	{
		const updatedHero = await Hero.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, useFindAndModify: false } //,
		);
		console.log("updatedHero hero: " + JSON.stringify(updatedHero));
		res.send(updatedHero);
	} catch (err)
	{
		console.log('error updating hero :' + err);
		return next(err);
	}
}
