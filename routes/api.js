const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");

// middleware
const isAuth = require("../middleware/is-auth");
const storeFile = require("../middleware/upload-file");

// controllers
const userController = require("../controllers/playlist");
const song = require("../controllers/song");
const album = require("../controllers/album");

const router = express.Router();
const uploadFile = multer({ storage: storeFile });

// /api/albums/${albumId}/songs

// albums - wystkie albumy jakie są w bazie
// playlist - wystkie playlisty jakie dane user posiada

// albums/add - dodawanie albumu dla danego usara
// playlist/add - dodawanie playlisty dla danego usara

// albums/:albumID - wystkie informacje dodyczącej danego albumu
// playlist/:playlistID - wystkie informacje dodyczące danej playlisty

// albums/:albumID/songs - wystkie piosenki w albumie
// playlist/:playlistID/song - wystkie piosenki w playliscie

// albums/:albumID/songs/add - dodawanie piosenki do albumu
// playlist/:playlist/song/add - dodawanie juz isniejącej piosenki do play listy

// songs/:songName - striming danej piosenki

router.get("/song/:filename", song.streamingSong);

router.post("/playlist");
router.post("/playlist/add");
router.post("/playlist/:playlistID");
router.post("/playlist/:playlistID/songs");
// todo router.post("/playlist/:playlistID/song/add")

router.get("/albums", album.getAlbums);
router.post("/albums/add",uploadFile.none(),
  [body("title").isEmpty()],
  album.addAlbum
);
router.get("/albums/:albumsID", album.getOneAlbum);
router.get("/albums/:albumsID/songs", album.getAlbumSongs);
router.post(
  "/albums/:albumsID/song/add",
  uploadFile.fields([{ name: "audio" }, { name: "image" }]),
  album.addSongToAlbum
);

// router.post(
//   "/add-new-playlist",
//   isAuth,
//   uploadAudio.single("image"),
//   userController.addNewPlaylist
// );

// router.get("/get-playlist", isAuth, userController.getPlaylist);

// router.post(
//   "/add-new-album",
//   uploadAudio.single("image"),
//   userController.addNewAlbum
// );
// router.get("/get-albums", userController.getAlbum);
// router.get(
//   "/api/albums/:albumId/songs",
//   uploadAudio.none(),
//   userController.getAlbumSong
// );

// router.post(
//   "/upload",
//   uploadAudio.fields([{ name: "audio" }, { name: "image" }]),
//   userController.addSongToAlbum
// );

// router.get("/getMp3List/:name", userController.getMp3Audio);
// const mp3FolderPath = path.join(__dirname, "../mp3");

// router.get("/getMp3List", (req, res) => {
//   fs.readdir(mp3FolderPath, (err, files) => {
//     if (err) {
//       console.error("Błąd podczas czytania folderu:", err);
//       return res.status(500).send("Wystąpił błąd podczas odczytu listy mp3.");
//     }

//     // Zwróć listę plików mp3
//     res.json(files.filter(file => file.endsWith(".mp3")));
//   });
// });

module.exports = router;
