const { createRxDatabase } = require('rxdb');

async function createDatabase() {

    const db = await createRxDatabase({
        name: 'medicaldb',
        storage: require('rxdb/plugins/storage-memory').getRxStorageMemory()
    });

    console.log('RxDB initialized');

    return db;
}

module.exports = createDatabase;