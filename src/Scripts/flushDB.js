const { sequelize } = require('../Models');

async function flushDB() {
    try {
        await sequelize.sync({ force: true });

        console.log('Database flushed ✅');

        process.exit(0);
    } catch (error) {
        console.error('Error ❌:', error);
        process.exit(1);
    }
}

flushDB();