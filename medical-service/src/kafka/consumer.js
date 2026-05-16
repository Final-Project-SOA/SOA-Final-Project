const eventBus =
    require('../../../appointment-service/src/kafka/eventBus');

const sendAppointmentEmail =
    require('../email/sendEmail');

console.log('Medical consumer listening...');

eventBus.on('appointment-created', async (data) => {

    console.log('NEW APPOINTMENT RECEIVED');

    console.log(data);

    await sendAppointmentEmail({

        patient: 'Fatma',

        email: 'fatma.belghith@polytechnicien.tn',

        doctor: data.doctor,

        date: data.date

    });

});