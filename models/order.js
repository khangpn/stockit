"use strict";

module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('order', {
      total_price: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Price is required"
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
          Order.hasMany(models.order_detail, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
          Order.belongsTo(models.customer, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );

  return Order;
};
