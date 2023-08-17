const Sequelize = require("sequelize");

const db = require("../util/database");

const Song = db.define("song", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  },
  artist: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Song;
