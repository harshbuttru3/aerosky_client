const {registerProcessingTeam,loginProcessingTeam,
	checkForProcessingTeamExist,updateProcessingTeamStatus,
	getProcessingTeamByIds,updateAssignedProjectsInProcessingTeam,
	getAllProcessingTeam} = require('../controllers/processingTeamControllers');

const router = require('express').Router();

router.post('/registerProcessingTeam',registerProcessingTeam);
router.post('/loginProcessingTeam',loginProcessingTeam);
router.post('/checkForProcessingTeamExist',checkForProcessingTeamExist);
router.post('/updateProcessingTeamStatus/:id',updateProcessingTeamStatus);
router.post('/getProcessingTeamByIds',getProcessingTeamByIds);
router.post('/updateAssignedProjectsInProcessingTeam/:id',updateAssignedProjectsInProcessingTeam);
router.post('/getAllProcessingTeam',getAllProcessingTeam);




module.exports = router;
