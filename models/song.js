const Sequelize = require("sequelize");

const db = require("../util/database");

const Song = db.define("song", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  artist: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.BLOB,
    allowNull: true,
  },
  file: {
    type: Sequelize.BLOB,
    allowNull: true,
  },
});

module.exports = Song;
