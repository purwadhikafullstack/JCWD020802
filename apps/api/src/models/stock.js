import { Model, DataTypes } from 'sequelize';

export default class Stock extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Stock.belongsTo(models.Warehouse),
    Stock.belongsTo(models.Product)
  }
}

export const init = (sequelize) => {
  Stock.init(
    {
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      sequelize,
      modelName: 'Stock',
    },
  );
};
