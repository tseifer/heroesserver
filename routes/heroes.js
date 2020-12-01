const express = require('express');
const heroesController = require('../controllers/heroesController');

const router = express.Router();


//
// const heroes = [
// 	{ _id: 11, name: 'Dr Nice' },
// 	{ _id: 12, name: 'Narco' },
// 	{ _id: 13, name: 'Bombasto' },
// 	{ _id: 14, name: 'Celeritas' },
// 	{ _id: 15, name: 'Magneta' },
// 	{ _id: 16, name: 'RubberMan' },
// 	{ _id: 17, name: 'Dynama' },
// 	{ _id: 18, name: 'Dr IQ' },
// 	{ _id: 19, name: 'Magma' },
// 	{ _id: 20, name: 'Tornado' }
// ];

function getUid() {
	return heroes.length > 0 ? Math.max(...heroes.map(heroes => heroes.id)) + 1 : 1;
}

router.get('/', heroesController.getAllHeroes)

router.get('/:id', heroesController.getHero)

router.post('/', heroesController.addHero);

router.delete('/:id', heroesController.deleteHero)

router.put('/:id', heroesController.updateHero);


module.exports = router;




