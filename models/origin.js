import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../connections/database.js';

class Origin extends Model { }
  
Origin.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        origin: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: 'origins',
        sequelize, // passing the `sequelize` instance is required;
    },
);

export default Roles;