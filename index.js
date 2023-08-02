const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Połączenie z bazą danych MongoDB (zmień wartość 'db_url' na odpowiednią adres URL do Twojej bazy danych)
mongoose.connect('mongodb://db_user:db_password@db_url/db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model użytkownika
const User = mongoose.model('User', {
  username: String,
  password: String,
});

// Model playlisty
const Playlist = mongoose.model('Playlist', {
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  private: Boolean,
  songs: [String],
});

// Middleware do obsługi JSON
app.use(express.json());

// Middleware do autoryzacji użytkownika za pomocą JWT tokena
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Brak autoryzacji. Brak tokena JWT.' });
  }

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Błąd autoryzacji. Nieprawidłowy token JWT.' });
    }
    req.user = user;
    next();
  });
};

// Middleware do obsługi przesyłania plików mp3
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Rejestracja nowego użytkownika
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Rejestracja udana. Możesz się teraz zalogować.' });
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera. Nie można zarejestrować użytkownika.' });
  }
});

// Logowanie użytkownika
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Błąd logowania. Nieprawidłowe dane logowania.' });
    }

    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera. Nie można zalogować użytkownika.' });
  }
});

// Tworzenie prywatnej playlisty
app.post('/playlists', authenticateUser, async (req, res) => {
  const { name, private, songs } = req.body;
  const userId = req.user.userId;

  try {
    const playlist = new Playlist({ userId, name, private, songs });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera. Nie można utworzyć playlisty.' });
  }
});

// Dodawanie pliku mp3 do playlisty
app.post('/playlists/:playlistId/songs', authenticateUser, upload.single('song'), async (req, res) => {
  const playlistId = req.params.playlistId;
  const songFile = req.file;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Nie znaleziono playlisty.' });
    }

    playlist.songs.push(songFile.filename);
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera. Nie można dodać pliku do playlisty.' });
  }
});

// Wyszukiwanie plików mp3 w bazie danych
app.get('/search', async (req, res) => {
  const { keyword } = req.query;

  try {
    const playlists = await Playlist.find({
      songs: { $regex: new RegExp(keyword, 'i') },
    });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera. Nie można wykonać wyszukiwania.' });
  }
});

// Obsługa nieodnalezionych ścieżek
app.use((req, res) => {
  res.status(404).json({ error: 'Nie znaleziono żądanego zasobu.' });
});

// Uruchomienie serwera na określonym porcie
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}.`);
});
