import { Sequelize } from "sequelize";
// const sequelize = new Sequelize( 'andarah', 'andarah-leadcenter', 'FyjAGPxv2Ru2206fKdhn', {
//     host: '127.0.0.1',
//     dialect: 'mysql',
//     port: 3306,
// });

const sequelize = new Sequelize( 'andarah', 'root', '78204991+?-', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306,
});

export default sequelize;