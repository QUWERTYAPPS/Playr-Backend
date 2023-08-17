const Sequelize = require("sequelize");
const db = require("../util/database");

const PlayListAlbum = db.define("playAlbumList", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = PlayListAlbum;
