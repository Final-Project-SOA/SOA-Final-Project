const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'appointment-service',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function publishAppointment(data) {

    await producer.connect();

    await producer.send({
        topic: 'appointments',
        messages: [
            {
                value: JSON.stringify(data)
            }
        ]
    });

    console.log('Kafka event published');

    await producer.disconnect();
}

module.exports = publishAppointment;