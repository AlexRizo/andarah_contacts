import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../connections/database.js';
import Staff from './staff.js';

class User extends Model { }
  
User.init(
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
        city: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        phone_number: {
            type: new DataTypes.STRING(15),
            allowNull: false,
        },
        reason: {
            type: new DataTypes.STRING(600),
            allowNull: false,
        },
        contact_status: {
            type: new DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
        date_contact: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        origin: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        pl: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        gr: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        staffId: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
        note: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
    },
    {
        tableName: 'users',
        sequelize, // passing the `sequelize` instance is required
    },
);

Staff.hasMany(User, { foreignKey: 'staffId', targetKey:'id', as:'asigned' });
User.belongsTo(Staff);

export default User;