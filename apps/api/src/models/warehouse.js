import { Model, DataTypes } from 'sequelize';

export default class Warehouse extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Warehouse.hasMany(models.WarehouseAdmin),
    Warehouse.hasMany(models.Stock),
    Warehouse.hasMany(models.StockMutation, { as: 'origin', foreignKey: 'originId' }),
    Warehouse.hasMany(models.StockMutation, { as: 'destination', foreignKey: 'destinationId' })
    Warehouse.belongsTo(models.City)
  }
}

export const init = (sequelize) => {
  Warehouse.init(
    {
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longtitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
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
      modelName: 'Warehouse',
    },
  );
};
