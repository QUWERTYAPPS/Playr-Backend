const Sequelize = require("sequelize");
const db = require("../util/database");

const PlayList = db.define("playList", {
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
  image: {
    type: Sequelize.BLOB,
    allowNull: true,
  },
});

module.exports = PlayList;