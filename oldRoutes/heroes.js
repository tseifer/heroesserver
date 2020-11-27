const express = require('express');
const router = express.Router();



const heroes = [
	{ _id: 11, name: 'Dr Nice' },
	{ _id: 12, name: 'Narco' },
	{ _id: 13, name: 'Bombasto' },
	{ _id: 14, name: 'Celeritas' },
	{ _id: 15, name: 'Magneta' },
	{ _id: 16, name: 'RubberMan' },
	{ _id: 17, name: 'Dynama' },
	{ _id: 18, name: 'Dr IQ' },
	{ _id: 19, name: 'Magma' },
	{ _id: 20, name: 'Tornado' }
];

function getUid() {
	return heroes.length > 0 ? Math.max(...heroes.map(heroes => heroes.id)) + 1 : 1;
}

router.get('/', (req, res) => {
	res.json(heroes)
})

router.get('/:id', (req, res) => { // if the request is localhost:5000/api/heroes/5
	let requiredId = parseInt(req.params.id); // "5"
	const found = heroes.find(heroe => heroe.id === requiredId);
	if (found) {
		res.json(found);
	} else {
		res.status(400).json({msg: 'NO heroe with ID of ' + requiredId});
	}
	
})

router.post('/', (req, res) => {
	const newId = getUid();
	const newheroe = {id: newId, ...req.body};
	console.log(req.body)
	if(!newheroe.name) {
		res.status(400).json({msg: 'Please include name and email'});
	} else {
		heroes.push(newheroe);
		res.json(heroes);
	}
});

router.delete('/:id', (req, res) => {
	const idToDelete = parseInt(req.params.id);
	const indexToDelete = heroes.findIndex(m => m.id === idToDelete);
	if (indexToDelete < 0)  {
		res.status(400).json({msg: `no heroe with id ${idToDelete}`});
	} else {
		//const deletedheroe = heroes[indexToDelete];
		const deletedheroe = heroes.splice(indexToDelete, 1)[0];
		res.json(deletedheroe);
	}
})

router.put('/:id', (req, res) => {
	const idToUpdate = parseInt(req.params.id);
	const heroeToUpdate = heroes.find(m => m.id === idToUpdate);
	if (heroeToUpdate)
	{
		Object.assign(heroeToUpdate, req.body);
		res.json(heroeToUpdate);
	} else {
		res.status(400).json({msg: `no heroe with id ${idToUpdate}`});
	}
	
	//read the body from the request, and update only the specific attributes that were defined in the body.
	// For example if for id 2 we have body of {"name": "kuku"} then we only update the name of the heroe that has id === 2
	// and then return the specific heroe in the response
	
});


module.exports = router;




