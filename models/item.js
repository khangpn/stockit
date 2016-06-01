"use strict";

module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('item', {
      name: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is required"
          }
        }
      },
      code: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Item code is required"
          }
        }
      },
      price: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Price is required"
          }
        }
      },
      in_stock: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          notEmpty: {
            msg: "Price is required"
          }
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
          Item.hasMany(models.stock_detail, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
          Item.hasMany(models.order_detail, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );

  return Item
};
