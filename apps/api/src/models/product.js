import { Model, DataTypes } from 'sequelize';

export default class Product extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Product.hasMany(models.Stock),
    Product.hasMany(models.StockMutation),
    Product.hasMany(models.TransactionProduct),
    Product.hasMany(models.Cart),
    Product.hasMany(models.ProductPicture),
    Product.belongsTo(models.ProductCategory)
  }
}

export const init = (sequelize) => {
  Product.init(
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productDetail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productWeight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productMainPicture: {
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
      modelName: 'Product',
    },
  );
};
