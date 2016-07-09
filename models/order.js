"use strict";

module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('order', {
      total_price: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
          Order.hasMany(models.order_detail, {
            onDelete: "CASCADE",
            //as: "details",
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
      },
      instanceMethods: {
        addPrice: function(subTotal) {
          if (typeof(price) === 'number' && subTotal > 0) {
            var oldTotal = this.total_price;
            this.setDataValue("total_price",  subTotal + oldTotal);
          }
        }
      }
    }
  );

  return Order;
};
