import { Sequelize } from "sequelize";

const sequelize = new Sequelize('railway', 'root', 'qDMoku9jSTuGoaJ9L8L8', {
    host: 'containers-us-west-174.railway.app',
    dialect: 'mysql',
    port: '7112'
});

export default sequelize;