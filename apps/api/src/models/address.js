import { Model, DataTypes } from 'sequelize';

export default class Address extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Address.belongsTo(models.City),
    Address.belongsTo(models.User)
  }
}

export const init = (sequelize) => {
  Address.init(
    {
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
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
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isMain: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },
    {
      sequelize,
      modelName: 'Address',
    },
  );
};
