const express = require('express');
const clientsController = require('../controllers/clientsController');

const router = express.Router();



const clients = [
	{ id: 11, name: 'Donald Trump' },
	{ id: 12, name: 'Vladimir Putin' },
	{ id: 13, name: 'Bibi Netaniau' },
	{ id: 14, name: 'Zoran Tegeltija' },
	{ id: 15, name: 'Manuel Marrero Cruz' },
	{ id: 16, name: 'Xi Jinping' },
	{ id: 17, name: 'Narendra Modi' },
	{ id: 18, name: 'Fayez al-Sarraj' },
	{ id: 19, name: 'Imran Khan' },
	{ id: 20, name: 'Nguyễn Xuân Phúc' }
	];

function getUid() {
	return clients.length > 0 ? Math.max(...clients.map(clients => clients.id)) + 1 : 1;
}

router.get('/', clientsController.getAllClients)

router.get('/:id', clientsController.getClient)

router.post('/', clientsController.addClient);

router.delete('/:id', clientsController.deleteClient)

router.put('/:id', clientsController.updateClient);



module.exports = router

