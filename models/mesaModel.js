const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Mesa extends Model {}

Mesa.init(
  {
    number: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    sequelize,
    modelName: "mesa",
    timestamps: false
  }
);

module.exports = Mesa