const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const clientController = require('../controllers/clientController');

router.use(auth);

router.post('/', clientController.createClient);
router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;