Microservcie architecture :

Components:

- API Gateway
- Patient Service
- Appointment Service
- Medical Service
- Kafka Broker
- SQLite3 databases
- RxDB NoSQL database

Communication:

- Client → Gateway:
  REST + GraphQL (HTTP/1.1)

- Gateway → Microservices:
  gRPC (HTTP/2 + Protobuf)

- Microservices communication:
  Kafka