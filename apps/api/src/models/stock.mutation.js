import { Model, DataTypes } from 'sequelize';

export default class StockMutation extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    StockMutation.belongsTo(models.Warehouse),
    StockMutation.belongsTo(models.Product)
  }
}

export const init = (sequelize) => {
  StockMutation.init(
    {
      stockMutation: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mutationStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'StockMutation',
    },
  );
};
