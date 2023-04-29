const { Router } = require('express');
const controller = require('./database_controller')
const router = Router();

router.get('/', controller.getPapers) ;
router.post('/add', controller.addPapers) ;
router.get('/:uid', controller.getPapers_uid);
router.post('/remove/:uid', controller.removePapers) ;

module.exports = router;
