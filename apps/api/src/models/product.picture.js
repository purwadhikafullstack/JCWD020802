import { Model, DataTypes } from 'sequelize';

export default class ProductPicture extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    ProductPicture.belongsTo(models.Product)
  }
}

export const init = (sequelize) => {
  ProductPicture.init(
    {
      productPicture: {
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
      modelName: 'ProductPicture',
    },
  );
};
