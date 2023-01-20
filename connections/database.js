import { Sequelize } from "sequelize";
const sequelize = new Sequelize( 'andarah', 'root', '78204991+?-', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;