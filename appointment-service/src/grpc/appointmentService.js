const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const sendAppointmentEmail =
    require('../../../medical-service/src/email/sendEmail');

const publishAppointment =
    require('../kafka/eventBus');

const PROTO_PATH =
    path.join(__dirname, '../../../proto/appointment.proto');

const packageDefinition =
    protoLoader.loadSync(PROTO_PATH);

const appointmentProto =
    grpc.loadPackageDefinition(packageDefinition).appointment;

const appointments = [];

function normalizeId(id) {
    return Number(id);
}

function GetAppointments(call, callback) {

    callback(null, {
        appointments
    });

}

async function CreateAppointment(call, callback) {

    const appointment = {
        id: Date.now(),
        patientId: call.request.patientId,
        doctor: call.request.doctor,
        date: call.request.date
    };

    appointments.push(appointment);

    console.log('Appointment created:', appointment);

    publishAppointment(appointment)
        .then(() => {
            console.log('Kafka process finished');
        })
        .catch((error) => {
            console.log('Kafka ignored:', error.message);
        });

    sendAppointmentEmail(appointment)
        .then(() => {
            console.log('MCP Email AI Agent triggered');
        })
        .catch((error) => {
            console.log('MCP Email AI Agent error:', error.message);
        });

    callback(null, appointment);

}

function UpdateAppointment(call, callback) {

    const id = normalizeId(call.request.id);

    const index = appointments.findIndex(
        (appointment) => normalizeId(appointment.id) === id
    );

    if (index === -1) {
        return callback({
            code: grpc.status.NOT_FOUND,
            message: 'Appointment not found'
        });
    }

    appointments[index] = {
        id,
        patientId: call.request.patientId,
        doctor: call.request.doctor,
        date: call.request.date
    };

    callback(null, appointments[index]);

}

function DeleteAppointment(call, callback) {

    const id = normalizeId(call.request.id);

    const index = appointments.findIndex(
        (appointment) => normalizeId(appointment.id) === id
    );

    if (index === -1) {
        return callback(null, {
            success: false,
            message: 'Appointment not found'
        });
    }

    appointments.splice(index, 1);

    callback(null, {
        success: true,
        message: 'Appointment deleted successfully'
    });

}

function SearchAppointments(call, callback) {

    const keyword = String(call.request.keyword || '').toLowerCase();

    const result = appointments.filter((appointment) =>
        String(appointment.patientId).includes(keyword) ||
        String(appointment.doctor).toLowerCase().includes(keyword) ||
        String(appointment.date).toLowerCase().includes(keyword)
    );

    callback(null, {
        appointments: result
    });

}

function main() {

    const server = new grpc.Server();

    server.addService(
        appointmentProto.AppointmentService.service,
        {
            GetAppointments,
            CreateAppointment,
            UpdateAppointment,
            DeleteAppointment,
            SearchAppointments
        }
    );

    server.bindAsync(
        '0.0.0.0:50052',
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {

            if (error) {
                console.log('Appointment gRPC error:', error.message);
                return;
            }

            console.log(`Appointment gRPC running on ${port}`);
            server.start();

        }
    );

}

main();