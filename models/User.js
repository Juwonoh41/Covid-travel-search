const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      isAlphanumeric: true,
      validate: {
        len: [8],
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        try {
          newUserData.password = await bcrypt.hash(newUserData.password, 8);
          return newUserData;
        } catch(err) {
          console.log(err);
          return err;
        }
      
      },
      beforeUpdate: async (updatedUserData) => {
        try {
          updatedUserData.password = await bcrypt.hash(updatedUserData.password, 8);
          return updatedUserData;
        }catch(err) {
          console.log(err);
          return err;
        }
      }
      
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'User',
  }
);

module.exports = User;
