const express = require('express');
const { getAll, getAllExercisesWithHistory, getOne, getOneWithHistory, create, update, remove } = require('../controllers/exerciseController');
const checkApiKey = require('../middlewares/checkApiKey');
const checkRoles = require('../middlewares/checkRoles');
const router = express.Router();

router.get('/history/:id_exercise/:username', getOneWithHistory);
router.get('/history/:username', getAllExercisesWithHistory);
router.get('/:id_exercise', getOne);
router.get('/', getAll);
router.post('/', create);
router.put('/:id', checkApiKey, checkRoles("admin"), update);
router.delete('/:id', checkApiKey, checkRoles("admin"), remove);

router.get('/mdp/', getAll);
router.get('/exerciseswithhistory/:username', getAllExercisesWithHistory);
router.get('/mdp/:id_exercise/:username', getOneWithHistory); 

module.exports = router;
