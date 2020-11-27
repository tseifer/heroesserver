const Client = require('../models/clientModel');

exports.getAllClients = function (req, res, next ) {
	Client.find( function(err, client) {
		if (err) {
			debug('update error:' + err);
			return next(err);
		}
		//On success
		res.send(client)
		// res.render('author_form', { title: 'Update Author', author: author });
	});
	
}

exports.getClient = function (req, res, next ) {
	req.sanitize('id').trim();
	Client.findById(req.params.id, function(err, client) {
		if (err) {
			debug('update error:' + err);
			return next(err);
		}
		//On success
		res.send(client)
		// res.render('author_form', { title: 'Update Author', author: author });
	});
}
exports.addClient = function (req, res, next ) {
	console.log(`addClient not implemented yet`)
}
exports.deleteClient = function (req, res, next ) {
	console.log(`deleteClient not implemented yet`)
}
exports.updateClient = function (req, res, next ) {
	console.log(`updateClient not implemented yet`)
}
