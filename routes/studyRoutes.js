const express = require('express');
const router = express.Router();

const StudyController = require('../controllers/StudyController');

router.get('/add', StudyController.createStudy);
router.post('/add', StudyController.createStudySave);
router.post('/remove', StudyController.removeStudy);
router.get('/edit/:id', StudyController.updateStudy);
router.post('/edit', StudyController.updateStudyPost);
router.post('/updatestatus', StudyController.toggleStudyStatus);
router.get('/', StudyController.index);

module.exports = router;
