import { Sequelize } from "sequelize";

// const sequelize = new Sequelize('railway', 'root', 'qDMoku9jSTuGoaJ9L8L8', {
//     host: 'containers-us-west-174.railway.app',
//     dialect: 'mysql',
//     port: '7112'
// });

const sequelize = new Sequelize( 'andarah', 'root', '78204991+?-', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;