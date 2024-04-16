const express = require('express');
const{protect,restrictTo} = require('../controllers/userControllers');
const {
    adminAcceptThings,
    adminRejectThings,
    deleteThingsAdmin,
    getAllThingsAdmin,
    adminAcceptPerson,
    adminRejectPerson,
    deletePersonAdmin,
    getAllPersonAdmin,
    adminAcceptPersonF,
    adminRejectPersonF,
    deletePersonFAdmin,
    getAllPersonFAdmin
} =require('../controllers/Admin');
const router = express.Router();


//things
router.post('/AcceptThings/:thingsID',protect,restrictTo,adminAcceptThings)
router.post('/RejectThings/:thingsID',protect,restrictTo,adminRejectThings)
router.delete('/Things/:thingsID',protect,restrictTo,deleteThingsAdmin)
router.get('/Things',protect,restrictTo,getAllThingsAdmin)
//person
router.post('/AcceptPerson/:PersonID',protect,restrictTo,adminAcceptPerson)
router.post('/RejectPerson/:PersonID',protect,restrictTo,adminRejectPerson)
router.delete('/Person/:PersonID',protect,restrictTo,deletePersonAdmin)
router.get('/Person',protect,restrictTo,getAllPersonAdmin)
//personF
router.post('/AcceptPersonF/:PersonID',protect,restrictTo,adminAcceptPersonF)
router.post('/RejectPersonF/:PersonID',protect,restrictTo,adminRejectPersonF)
router.delete('/PersonF/:PersonID',protect,restrictTo,deletePersonFAdmin)
router.get('/PersonF',protect,restrictTo,getAllPersonFAdmin)
module.exports = router;