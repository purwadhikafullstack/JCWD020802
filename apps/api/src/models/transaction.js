import { Model, DataTypes } from 'sequelize';

export default class Transaction extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Transaction.hasMany(models.TransactionProduct),
    Transaction.belongsTo(models.User)
  }
}

export const init = (sequelize) => {
  Transaction.init(
    {
      deliveryCost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'Transaction',
    },
  );
};
