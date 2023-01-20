import { Sequelize } from "sequelize";
const sequelize = new Sequelize( 'andarah', 'andarah-leadcenter', 'TSXTJjvg9MOz4uuQnt2g', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306,
});

export default sequelize;