"use strict";

module.exports = function(sequelize, DataTypes) {
  var Order_Detail = sequelize.define('order_detail', {
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
            msg: "Total price is required"
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
          Order_Detail.belongsTo(models.order, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
          Order_Detail.belongsTo(models.item, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );

  return Order_Detail;
};
