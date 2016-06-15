"use strict";

module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define('admin', {
      fullname: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Fullname is required"
          },
          len: {
            args: [8, 128],
            msg: "Fullname should be from 8 to 128 characters length"
          }
        }
      },
      note: { 
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    { 
      underscored: true,
      freezeTableName: true,
      classMethods: {
        associate: function(models) {
          Admin.belongsTo(models.account, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );

  return Admin
};
