const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const mp3FolderPath = path.join(__dirname, 'mp3');

app.use(cors())

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader('Access-Control-Allow-Methods', '*')
//     // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DE')
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//     next()
// })

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

// Uruchamianie serwera
const port = 3000; // lub inny wybrany numer portu
app.listen(port, () => {
  console.log(`Serwer jest uruchomiony na porcie ${port}`);
});
