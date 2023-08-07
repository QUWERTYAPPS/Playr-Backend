const express = require('express');
const userController = require('../controllers/userControllers')
const isAuth = require('../middleware/is-auth')
const PlayList = require('../models/playlist')
const Album = require('../models/album')
const User = require('../models/user')


const router = express.Router();

// router.post('/add-new-playlit', isAuth, authController.test)
// router.post('/add-new-album', isAuth, authController.test)
// router.post('/add-new-song',isAuth, authController.test)


router.post('/add-new-playlist', isAuth, userController.addNewPlaylist)

router.get('/get-playlist', isAuth, userController.getPlaylist)

router.post('/add-new-album', isAuth, userController.addNewAlbum)
router.get('./get-album', isAuth, userController.getAlbum)




module.exports = router;