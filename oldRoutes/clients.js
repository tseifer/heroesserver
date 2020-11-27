const express = require('express');
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

router.get('/', (req, res) => {
	res.json(clients)
})

router.get('/:id', (req, res) => { // if the request is localhost:5000/api/clients/5
	let requiredId = parseInt(req.params.id); // "5"
	const found = clients.find(clients => clients.id === requiredId);
	if (found) {
		res.json(found);
	} else {
		res.status(400).json({msg: 'NO clients with ID of ' + requiredId});
	}
	
})

router.post('/', (req, res) => {
	const newId = getUid();
	const newclient = {id: newId, ...req.body};
	console.log(req.body)
	if(!newclient.name) {
		res.status(400).json({msg: 'Please include name and email'});
	} else {
		clients.push(newclient);
		res.json(clients);
	}
});

router.delete('/:id', (req, res) => {
	const idToDelete = parseInt(req.params.id);
	const indexToDelete = clients.findIndex(m => m.id === idToDelete);
	if (indexToDelete < 0)  {
		res.status(400).json({msg: `no clients with id ${idToDelete}`});
	} else {
		//const deletedclient = clients[indexToDelete];
		const deletedclient = clients.splice(indexToDelete, 1)[0];
		res.json(deletedclient);
	}
})

router.put('/:id', (req, res) => {
	const idToUpdate = parseInt(req.params.id);
	const clientToUpdate = clients.find(m => m.id === idToUpdate);
	if (clientToUpdate)
	{
		Object.assign(clientToUpdate, req.body);
		res.json(clientToUpdate);
	} else {
		res.status(400).json({msg: `no clients with id ${idToUpdate}`});
	}
	
	//read the body from the request, and update only the specific attributes that were defined in the body.
	// For example if for id 2 we have body of {"name": "kuku"} then we only update the name of the clients that has id === 2
	// and then return the specific clients in the response
	
});



module.exports = router

