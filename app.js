require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const db = require('./util/database')
const User = require('./models/user')
const PlayList = require('./models/playlist')
const PlayListItem = require('./models/playlist-item')
const PlayListAlbum = require('./models/playlist-album')
const PlayListAlbumItem = require('./models/playlist-album-item')
const Album = require('./models/album')
const AlbumItem = require('./models/album_item')
const Song = require('./models/song')

const authRoutes = require('./routes/auth')

const mp3FolderPath = path.join(__dirname, 'mp3');

// app.use(cors())


// Playlist.belongsToMany()


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  });
// Obsługa żądań GET do pobierania plików mp3
app.get('/getMp3List/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(mp3FolderPath, filename);

  // Sprawdź, czy plik istnieje
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Plik nie istnieje.');
  }

  // Ustaw nagłówki do pobierania pliku
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  // Pobierz plik i przesyłaj go do klienta jako strumień
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});
app.use(authRoutes)

// Obsługa żądania GET, które zwraca listę plików mp3
app.get('/getMp3List', (req, res) => {
  fs.readdir(mp3FolderPath, (err, files) => {
    if (err) {
      console.error('Błąd podczas czytania folderu:', err);
      return res.status(500).send('Wystąpił błąd podczas odczytu listy mp3.');
    }

    // Zwróć listę plików mp3
    res.json(files.filter((file) => file.endsWith('.mp3')));
  });
});

// Serwowanie frontendu
app.use(express.static(path.join(__dirname, 'public')));

// Obsługa innych żądań
app.get('/', (req, res) => {
  res.send('Witaj na mojej platformie strumieniowej!');
});


User.hasMany(PlayList)
PlayList.belongsTo(User, {caontraints: true, onDelete: 'CASCADE'})

User.hasMany(Album)
Album.belongsTo(User, {caontraints: true, onDelete: 'CASCADE'})

Album.hasMany(Song)
Album.belongsToMany(Song, {through: AlbumItem})

PlayList.belongsToMany(Song, {through: PlayListItem})
PlayListAlbum.belongsToMany(Album, {through: PlayListAlbumItem})

const port = process.env.PORT || 8080;

db.sync({force: false})
    .then(user => {
        app.listen(port);
        console.log(`server work on port = ${port}`)
    })
    .catch(err => {
        console.log(err)
    })