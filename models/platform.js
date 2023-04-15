import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../connections/database.js';

class Platform extends Model { }
  
Platform.init(
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
    },
    {
        tableName: 'platforms',
        sequelize, // passing the `sequelize` instance is required;
    },
);

export default Platform;