const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'appointment-service',
    brokers: ['localhost:9092'],
    connectionTimeout: 1000,
    requestTimeout: 1000,
    retry: {
        retries: 0
    }
});

const producer = kafka.producer();

let connected = false;

async function publishAppointment(appointment) {

    try {

        if (!connected) {
            await producer.connect();
            connected = true;
        }

        await producer.send({
            topic: 'appointment-created',
            messages: [
                {
                    value: JSON.stringify(appointment)
                }
            ]
        });

        console.log('Kafka event published');

    } catch (error) {

        console.log('Kafka not available. Event simulated locally.');
        console.log('Simulated event: appointment-created');
        console.log(appointment);

    }

}

module.exports = publishAppointment;