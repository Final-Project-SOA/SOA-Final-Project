const eventBus = require('../../../appointment-service/src/kafka/eventBus');

eventBus.on(
    'appointment-created',
    (data) => {

        console.log('Medical Service received event');

        console.log(data);

    }
);

const createDatabase = require('../rxdb/database');
Puis :

(async () => {
    await createDatabase();
})();

console.log('Medical consumer listening...');