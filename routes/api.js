const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");

// middleware
const isAuth = require("../middleware/is-auth");
const storeFile = require("../middleware/upload-file");

// controllers
const song = require("../controllers/song");
const album = require("../controllers/album");
const playlist = require("../controllers/playlist");

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

router.post("/playlist",isAuth, playlist.getPlaylist);
router.post(
  "/playlist/add",
  isAuth,
  uploadFile.none(),
  // [body("title").isEmpty()],
  playlist.addPlaylist
);
router.post('/playlist/get',isAuth, playlist.getAllMePlaylist)
router.post("/playlist/:playlistID",isAuth, playlist.getPlaylist);
router.post("/playlist/:playlistID/songs",isAuth, playlist.getPlaylistSongs);
router.post("/playlist/:playlistID/:songID/add",isAuth, playlist.addSongToPlaylist)

// albums
router.get("/albums", album.getAlbums);
router.post(
  "/albums/add",
  isAuth,
  uploadFile.none(),
  [body("title").isEmpty()],
  album.addAlbum
);
router.get("/albums/:albumsID", album.getOneAlbum);
router.get("/albums/:albumsID/songs", album.getAlbumSongs);
router.post(
  "/albums/:albumsID/song/add",
  isAuth,
  [body("title").isEmpty()],
  uploadFile.fields([{ name: "audio" }, { name: "image" }]),
  album.addSongToAlbum
);

module.exports = router;
