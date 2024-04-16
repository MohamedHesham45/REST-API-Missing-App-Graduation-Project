const express = require('express');
const router = express.Router();
const {protect}= require('../controllers/userControllers');
const {
     uploadThingsPhoto,
     uploadNewThings,
     getAllThings,
     getThingsForUser,
     uploadThingsPhoto,
     updateUserThings,
     deleteThingsForUser,
     conterFoundThings
}=require('../controllers/thingsController');
router.route('/things').post(protect,
uploadThingsPhoto,
uploadNewThings)
.get(getAllThings)

router.get('/thingsMe',protect,getThingsForUser)
router.route('/thingsMe/:thingsID')
.patch(protect,uploadThingsPhoto,updateUserThings)
.delete(protect,deleteThingsForUser)
router.get('/search',search)
router.post('/found/:thingsID',protect,conterFoundThings)

module.exports = router;