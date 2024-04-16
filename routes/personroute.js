const router=require("express").Router()
const {protect}=require('../controllers/userControllers')
const personControllers=require('../controllers/missingPersonController')
const personControllersF=require('../controllers/reportFound')
const imageSearch=require('../controllers/searchByImage')
const NSFWc=require('../controllers/NSFW')


router.post('/missingperson',protect,
personControllers.uploadPersonPhoto,imageSearch.photoUploadPerson,NSFWc.NSFWfun,personControllers.uploadData)
router.get('/Missing',personControllers.getData)
router.get("/MissingByUser",protect,personControllers.getFUllDataByTheSameUser)
router.patch("/Missing/:idMissing",protect,personControllers.uploadPersonPhoto,imageSearch.faceNo,NSFWc.NSFWfun,personControllers.updateDataofuser)

router.delete("/Missing/:idMissing",protect,personControllers.deleteData)

router.get('/search',personControllers.searchData)



/////////////////////////////////////////////

router.post('/Missingf',protect,
personControllersF.uploadPersonPhoto
,imageSearch.photoUploadPerson,NSFWc.NSFWfun,personControllersF.uploadData)
router.get('/MissingF',personControllersF.getData)
router.get("/MissingByUserF",protect,personControllersF.getFUllDataByTheSameUser)
router.patch("/MissingF/:idMissingF",protect,personControllers.uploadPersonPhoto,imageSearch.faceNo,NSFWc.NSFWfun,personControllersF.updateDataofuser)

router.delete("/MissingF/:idMissingF",protect,personControllersF.deleteData)

router.get('/searchF',personControllersF.searchData)

///////////

router.get('/All',personControllers.searchForAllDataPerson)
router.get('/PersonId/:where?',personControllers.getAllDataPersonAndLockingFamile)

router.post('/searchByImage',personControllers.uploadPersonPhoto,imageSearch.searchPhoto)

router.post('/found/:idMissing',protect,personControllers.conterFound)

router.get('/conterFound',personControllers.getConterFound)

module.exports=router;
