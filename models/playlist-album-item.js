const Sequelize = require("sequelize");
const db = require("../util/database");

const PlayListAlbumItem = db.define("playAlbumListItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = PlayListAlbumItem;
