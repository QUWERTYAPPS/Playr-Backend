require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./util/database");
const User = require("./models/user");
const Playlist = require("./models/Playlist");
const PlaylistItem = require("./models/playlist-item");
const Album = require("./models/album");
const Song = require("./models/song");

// rouets
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads/image', express.static(path.join(__dirname, 'uploads/image')))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Cache-Control', 'no-store');


  next();
});

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data, error: error});
});

User.hasMany(Playlist);
Playlist.belongsTo(User, { caontraints: true, onDelete: "CASCADE" });

User.hasMany(Album);
Album.belongsTo(User, { caontraints: true, onDelete: "CASCADE" });

Album.hasMany(Song);
// Album.belongsToMany(Song, { through: AlbumItem });

Playlist.belongsToMany(Song, { through: PlaylistItem });
// PlaylistAlbum.belongsToMany(Album, { through: PlaylistAlbumItem });

const port = process.env.PORT || 8080;

// {force: false}
db.sync({ force: false})
  .then(user => {
    app.listen(port);
    console.log(`server work on port = ${port}`);
  })
  .catch(err => {
    console.log(err);
  });