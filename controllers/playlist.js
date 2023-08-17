const PlayList = require("../models/playlist");
const Album = require("../models/album");
const User = require("../models/user");
const Song = require("../models/song");
const path = require("path");
const fs = require("fs");

exports.addNewPlaylist = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const title = req.body.title || "test";
    const imageUrl = req.file.path.replace("\\" ,"/");
    console.log(title)
    const user = await User.findOne({ where: { id: userId } });
    await user.createPlayList({ title: title, image: imageUrl });
    res.status(200).json({ message: "creating playlist" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPlaylist = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: { model: PlayList },
    });
    res.status(200).json({ userId: userId, playlist: user.playlists });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addNewAlbum = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const title = req.body.title || "test";
    const imageUrl = req.file.path.replace("\\" ,"/");
    const user = await User.findOne({
      where: { id: userId },
      include: { model: Album }, 
    });
    if (user.albums.length < 3) {
      await user.createAlbum({ title: title, image: imageUrl });
      res.status(200).json({ message: "creating album" });
    } else {
      res.status(405).json({ message: "don't can creat album" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAlbum = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: { model: Album },
    });
    res.status(200).json({ userId: userId, album: user.albums });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addSongToAlbum = async (req, res) => {
  const userId = req.user.id;
  const file = req.files
  const id_album = 1
  const name = "test"
  const artist = 'test2'
  // console.log(file.audio[0].path.replace("\\" ,"/"))
  const audio = file.audio[0].path.replace("\\" ,"/")
  // const image = file.image[0].path.replace("\\" ,"/")
  const user = await User.findOne({
    where: { id: userId },
    include: { model: Album},
  });
  console.log('user',user)
  // console.log('albums', user.albums)
  // const album = user.albums.album.dataValues
  // console.log(user.albums[1].dataValues)
  // console.log('tset',user.albums.filter((prevdata) => prevdata.dataValues.id == id_album))
  // const album = user.albums.filter((prevdata) => prevdata.dataValues.id == id_album)
  // const album = await user.albums[0]
  const album = user.albums.filter((prevdata) => prevdata.dataValues.id == id_album)
  console.log(album)
  await album[0].createSong({title:name, artist: artist, file: audio});

  // await user.albums.createSong({title:name, artist: artist, file: audio});
};

exports.getMp3Audio = async (req, res,next) => {
  const mp3FolderPath = path.join(__dirname, "../uploads/audio");
  const filename = req.params.name;
  // console.log(mp3FolderPath)
  const filePath = path.join(mp3FolderPath, filename+ '.mp3');
  console.log(filePath)

  try {
    if (!fs.existsSync(filePath)) {
      console.log(4)
      // return res.status(404).send("Plik nie istnieje.");
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    console.log(1)
    const stream = fs.createReadStream(filePath);
    console.log(2)
    stream.pipe(res);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.addtoplaylist = async (req, res) => {
  const userId = req.user.id;
  const file = req.files
  const id_playlist= 1
  const id_song = 1
  const name = "test"
  const artist = 'test2'
  // console.log(file.audio[0].path.replace("\\" ,"/"))
  const audio = file.audio[0].path.replace("\\" ,"/")
  // const image = file.image[0].path.replace("\\" ,"/")
  const user = await User.findOne({
    where: { id: userId },
    include: { model: PlayList},
  });
  console.log('user',user)

  const playlist = user.playlists.filter((prevdata) => prevdata.dataValues.id == id_album)
  console.log(playlist)
  playlist[0].addSong({where: {id: id_song}})

}

exports.getAlbumSong = async(req, res, next) => {
  const id_album = req.params.albumId
  console.log("work ",id_album)
  const album = await Album.findOne({where: {id: id_album}, include: {model: Song}})
  // console.log(album)
  res.status(200).json({album: album})

}