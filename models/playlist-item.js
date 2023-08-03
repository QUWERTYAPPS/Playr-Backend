const Sequelize = require("sequelize");
const db = require("../util/database");

const PlayListItem = db.define("playlistItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = PlayListItem;
