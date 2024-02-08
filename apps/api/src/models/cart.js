import { Model, DataTypes } from 'sequelize';

export default class Cart extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Cart.belongsTo(models.User),
    Cart.belongsTo(models.Product)
  }
}

export const init = (sequelize) => {
  Cart.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 1
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }
    },
    {
      sequelize,
      modelName: 'Cart',
    },
  );
};
