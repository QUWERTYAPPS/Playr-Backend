const Sequelize = require("sequelize");

const db = require("../util/database");

const Album = db.define("album", {
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
  artist: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Album;
