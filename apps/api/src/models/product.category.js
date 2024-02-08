import { Model, DataTypes } from 'sequelize';

export default class ProductCategory extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    ProductCategory.hasMany(models.Product)
  }
}

export const init = (sequelize) => {
  ProductCategory.init(
    {
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      sequelize,
      modelName: 'ProductCategory',
    },
  );
};
