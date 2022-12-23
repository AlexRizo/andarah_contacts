import { Sequelize } from "sequelize";

const sequelize = new Sequelize('useful-war', 'root', 'qDMoku9jSTuGoaJ9L8L8', {
    host: 'containers-us-west-174.railway.app',
    dialect: 'mysql',
});

export default sequelize;