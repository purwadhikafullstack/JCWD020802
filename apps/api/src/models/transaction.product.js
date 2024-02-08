import { Model, DataTypes } from 'sequelize';

export default class TransactionProduct extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    TransactionProduct.belongsTo(models.Transaction),
    TransactionProduct.belongsTo(models.Product)
  }
}

export const init = (sequelize) => {
  TransactionProduct.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'TransactionProduct',
    },
  );
};
