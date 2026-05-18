const { Kafka } = require('kafkajs');

const sendAppointmentEmail =
    require('../email/sendEmail');

const kafka = new Kafka({
    clientId: 'medical-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({
    groupId: 'medical-group'
});

async function run() {

    await consumer.connect();

    await consumer.subscribe({
        topic: 'appointments',
        fromBeginning: true
    });

    console.log('Medical consumer listening...');

    await consumer.run({

        eachMessage: async ({ message }) => {

            const data =
                JSON.parse(message.value.toString());

            console.log('NEW APPOINTMENT RECEIVED');

            console.log(data);

            await sendAppointmentEmail({

                patient: 'Fatma',

                email: 'fatma.belghith@polytechnicien.tn',

                doctor: data.doctor,

                date: data.date
            });
        }
    });
}

run();