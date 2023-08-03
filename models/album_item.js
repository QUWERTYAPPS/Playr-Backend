const Sequelize = require("sequelize");

const db = require("../util/database");

const AlbumItem = db.define("AlbumItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  }
});

module.exports = AlbumItem;
