const Album = require("../models/album");
const User = require("../models/user");
const Song = require("../models/song");
const { validationResult } = require("express-validator");

exports.getAlbums = async (req, res, next) => {
  try {
    const albums = await Album.findAll();
    if (!albums) {
      const error = new Error("Cannot find any albums, please create one.");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ message: "All albums", albums: albums });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.addAlbum = async(req, res, next) => {
  const errors = validationResult(req);
  const maxCountAlbums = 3;
  const userID = req.user.id;
  const title = req.body.title;
  try {
    if (errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findOne({
      where: {
        id: userID,
      },
      include: {
        model: Album,
      },
    });

    if (!user) {
      const error = new Error("User does not exist");
      error.statusCode = 422;
      throw error;
    }
    if (user.albums.length < maxCountAlbums) {
      await user.createAlbum({ title: title });
      res.status(200).json({ message: "Album was created." });
    } else {
      res.status(200).json({ message: "You have too many albums" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOneAlbum = async (req, res, next) => {
  const albumID = req.params.albumsID;
  try {
    const album = await Album.findOne({ where: { id: albumID } });
    if (!album) {
      const error = new Error("Cannot find this album");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ message: "Album by id", album: album });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.getAlbumSongs = async (req, res, next) => {
  const albumID = req.params.albumsID;
  try {
    const album = await Album.findOne({
      where: {
        id: albumID,
      },
      include: {
        model: Song,
      },
    });
    if (!album) {
      const error = new Error("Cannot find this album");
      error.statusCode = 422;
      throw error;
    }
    const songs = album.songs;
    res.status(200).json({ message: "Albums Songs", songs: songs });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.addSongToAlbum = async (req, res, next) => {
  const albumID = req.params.albumsID;
  const userID = req.user.id;
  const title = req.body.title || "test";
  const audioFilename = req.files.audio[0].filename;
  const image = req.files.image[0].path.replace("\\", "/");
  try {
    const user = await User.findOne({
      where: { id: userID },
    });
    if (!user) {
      const error = new Error("Cannot fint the user");
      error.statusCode = 422;
      throw error;
    }
    const artist = user.name;
    const album = await Album.findOne({
      where: { id: albumID },
    });
    if (!album) {
      const error = new Error("Cannot fint the album");
      error.statusCode = 422;
      throw error;
    }
    console.log(album)
    await album.createSong({
      title: title,
      filename: audioFilename,
      image: image,
      artist: artist,
    });
    res.status(200).json({ message: "add song to album" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};
