"use strict";

module.exports = function(sequelize, DataTypes) {
  var Stock_Detail = sequelize.define('stock_detail', {
      price: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Price is required"
          }
        }
      },
      quantity: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Quantity is required"
          }
        }
      },
      total_price: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Total is required"
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
          Stock_Detail.belongsTo(models.stock, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
          Stock_Detail.belongsTo(models.item, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );

  return Stock_Detail;
};
