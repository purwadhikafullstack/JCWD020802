import { Model, DataTypes } from 'sequelize';

export default class WarehouseAdmin extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    WarehouseAdmin.belongsTo(models.User),
    WarehouseAdmin.belongsTo(models.Warehouse)
  }
}

export const init = (sequelize) => {
  WarehouseAdmin.init(
    {
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      sequelize,
      modelName: 'WarehouseAdmin',
    },
  );
};
