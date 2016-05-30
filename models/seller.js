"use strict";

module.exports = function(sequelize, DataTypes) {
  var Seller = sequelize.define('seller', {
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
      email: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: {
            msg: "Email is required"
          }
        }
      },
      address: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Address is required"
          }
        }
      },
      phone: { 
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isNumeric: true
        }
      },
      website: { 
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true
        }
      },
      description: { 
        type: DataTypes.STRING,
        allowNull: true
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
          // Uncomment if would like to support seller login
          //Seller.belongsTo(models.account, {
          //  onDelete: "CASCADE",
          //  foreignKey: {
          //    allowNull: false
          //  }
          //});
          Seller.hasMany(models.stock, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );

  return Seller;
};
