const Playlist = require("../models/Playlist");
const User = require("../models/user");
const Song = require("../models/song");
const { validationResult } = require("express-validator");

exports.getPlaylist = async (req, res, next) => {
  try {
    const Playlist = await Playlist.findAll();
    if (!Playlist) {
      const error = new Error("Cannot find any Playlist, please create one.");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ message: "All Playlist", Playlists: Playlist });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllMePlaylist = async (req, res, next) => {
  const userID = req.user.id
  // console.log(userID)
  try{
    const user = await User.findOne({
      where: {id: userID},
      include: {model: Playlist}
    })

    if (!user) {
      const error = new Error("User does not exist");
      error.statusCode = 422;
      throw error;
    }
    // console.log(user)
    res.status(200).json({message: "your all Playlist", Playlist: user.Playlists})
  }catch(err){
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.addPlaylist = async (req, res, next) => {
  const errors = validationResult(req);
  const userID = req.user.id;
  const title = req.body.title || "test";
  console.log(errors)
  try {
    if (errors.errors[0]) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findOne({
      where: {
        id: userID,
      },
    });

    if (!user) {
      const error = new Error("User does not exist");
      error.statusCode = 422;
      throw error;
    }
    await user.createPlaylist({ title: title });
    res.status(200).json({ message: "Playlist was created." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOnePlaylist = async (req, res, next) => {
  const PlaylistID = req.params.PlaylistID;
  try {
    const Playlist = await Playlist.findOne({ where: { id: PlaylistID } });
    if (!Playlist) {
      const error = new Error("Cannot find this Playlist");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ message: "Playlist by id", Playlist: Playlist });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPlaylistSongs = async (req, res, next) => {
  const PlaylistID = req.params.PlaylistID;
  try {
    const Playlist = await Playlist.findOne({
      where: {
        id: PlaylistID,
      },
      include: {
        model: Song,
      },
    });
    if (!Playlist) {
      const error = new Error("Cannot find this Playlist");
      error.statusCode = 422;
      throw error;
    }
    const songs = Playlist.songs;
    res.status(200).json({ message: "Playlist Songs", songs: songs });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addSongToPlaylist = async (req, res, next) => {
  const playlistID = req.params.playlistID;
  const songID = req.params.songID;
  const userID = req.user.id;
  
  try {
    const user = await User.findOne({ where: { id: userID } });
  
    if (!user) {
      const error = new Error("User does not exist");
      error.statusCode = 422;
      throw error;
    }
  
    const Playlists = await user.getPlaylists({ where: { id: playlistID } });
  
    if (Playlists.length > 0) {
      const Playlist = Playlists[0];
      const songs = await Playlist.getSongs({ where: { id: songID } });
      if (!songs[0]) {
        await Playlist.addSong(songID)
        res.status(200).json({ message: "song added to Playlist" });
      } else {
        res.status(200).json({ message: "The song already exists in your Playlist" });
      }
    } else {
      res.status(404).json({ message: "There is no such Playlist." });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
};

