import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../connections/database.js';

class Roles extends Model { }
  
Roles.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        rol: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: 'roles',
        sequelize, // passing the `sequelize` instance is required;
    },
);

export default Roles;