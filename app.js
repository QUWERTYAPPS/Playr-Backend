require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./util/database");
const User = require("./models/user");
const PlayList = require("./models/playlist");
const PlayListItem = require("./models/playlist-item");
const PlayListAlbum = require("./models/playlist-album");
const PlayListAlbumItem = require("./models/playlist-album-item");
const Album = require("./models/album");
const AlbumItem = require("./models/album_item");
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


app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
        req.user = user
        next()
    })
    .catch(err => console.log(err))
})

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data, error: error});
});

User.hasMany(PlayList);
PlayList.belongsTo(User, { caontraints: true, onDelete: "CASCADE" });

User.hasMany(Album);
Album.belongsTo(User, { caontraints: true, onDelete: "CASCADE" });

Album.hasMany(Song);
// Album.belongsToMany(Song, { through: AlbumItem });

PlayList.belongsToMany(Song, { through: PlayListItem });
PlayListAlbum.belongsToMany(Album, { through: PlayListAlbumItem });

const port = process.env.PORT || 8080;

// {force: false}
db.sync({ force: false })
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: "Max",
        email: "text@gmail.com",
        password: "test",
      });
    }

    return user;
  })
  .then(user => {
    app.listen(port);
    console.log(`server work on port = ${port}`);
  })
  .catch(err => {
    console.log(err);
  });