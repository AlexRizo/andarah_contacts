import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../connections/database.js';
import Role from './role.js';

class Staff extends Model { }
  
Staff.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        password: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        status: {
            type: new DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: true,
        },
        roleId: {
            type: new DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
    },
    {
        tableName: 'staff',
        sequelize, // passing the `sequelize` instance is required
    },
);

Role.hasMany(Staff, { foreignKey: 'roleId', targetKey:'id' });
Staff.belongsTo(Role);

export default Staff;