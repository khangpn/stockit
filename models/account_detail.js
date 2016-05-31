"use strict";

module.exports = function(sequelize, DataTypes) {
  var AccountDetail = sequelize.define('account_detail', {
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
          AccountDetail.belongsTo(models.account, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );

  return AccountDetail
};
