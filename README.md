Système SOA de Gestion de Clinique Intelligente
----------------------------------------------------------------------------------------------------------------------------
Description du projet
Ce projet est une application basée sur une architecture orientée services (SOA) permettant la gestion d’une clinique médicale.
--------------------------------------------------------------------------------------------------------------------------
Il simule un système réel basé sur des microservices distribués communiquant via :
REST API
gRPC
Kafka (event-driven)
GraphQL
Frontend React

Le système permet de gérer :
-Patients
Rendez-vous médicaux
Notifications automatiques par email
Interface web moderne
Cache offline (RxDB)

Architecture du système

Frontend (React + RxDB)
        |
        v
API Gateway (Node.js + Express)
        |
        |------------------------|
        |                        |
Patient Service         Appointment Service
(gRPC + SQLite)         (gRPC + Kafka Producer)
                                |
                                v
                    Medical Service (Kafka Consumer)
                                |
                                v
                 Email Notification (Nodemailer Gmail)

-----------------------------------------------------------------------------------------------------------------------------
Technologies utilisées
----------------------------------------------------------------------------------------------------------------------------
Node.js
Express.js
gRPC
Kafka (architecture événementielle)
SQLite
Nodemailer (email automatique)
-----------------------------------------------------------------------------------------------------------------------------
Frontend
React (Vite)
Axios
React Router
RxDB (base de données offline)
----------------------------------------------------------------------------------------------------------------------------
Microservices
1-Service Patient
Gestion des patients (CRUD)
API gRPC
Base de données SQLite

2-Service Rendez-vous (Appointment)
Création et affichage des rendez-vous
Communication gRPC
Publication d’événement Kafka

3-Service Médical
Consomme les événements Kafka
Reçoit les rendez-vous créés
Déclenche l’envoi d’email automatique

4-API Gateway
Point d’entrée unique du système
Expose des routes REST
Communique avec les microservices via gRPC

5-Frontend React
Dashboard moderne
Gestion des patients
Gestion des rendez-vous
Interface utilisateur responsive
Cache offline avec RxDB
---------------------------------------------------------------------------------------------------------------------------
Système de notification (Email AI Agent)
Lorsqu’un rendez-vous est créé :

Le service Appointment publie un événement Kafka
Le service Medical le consomme
Un email est envoyé automatiquement via Gmail SMTP

Contenu de l’email :

ID du patient
Nom du médecin
Date du rendez-vous
-----------------------------------------------------------------------------------------------------------------------------
Fonctionnalité Offline (RxDB)
Le frontend utilise RxDB pour :

Stocker les données localement
Fonctionner sans internet
Synchroniser automatiquement avec le backend
----------------------------------------------------------------------------------------------------------------------------

Fonctionnalités principales

Architecture SOA complète
Microservices distribués
Communication gRPC
Event-driven avec Kafka
API REST + GraphQL
Frontend React moderne
Cache offline RxDB
Notifications email automatiques

