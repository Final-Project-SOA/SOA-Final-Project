import {
    createRxDatabase
} from 'rxdb';

import {
    getRxStorageMemory
} from 'rxdb/plugins/storage-memory';

let db;

export async function initDB() {

    db = await createRxDatabase({

        name: 'clinicdb',

        storage: getRxStorageMemory()

    });

    await db.addCollections({

        patients: {

            schema: {

                title: 'patients schema',

                version: 0,

                primaryKey: 'id',

                type: 'object',

                properties: {

                    id: {
                        type: 'string'
                    },

                    name: {
                        type: 'string'
                    },

                    disease: {
                        type: 'string'
                    }

                },

                required: [
                    'id',
                    'name',
                    'disease'
                ]

            }

        }

    });

    return db;
}

export { db };