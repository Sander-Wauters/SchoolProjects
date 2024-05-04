[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/snPWRHYg)

# Examenopdracht Web Services

-   Student: Sander Wauters
-   Studentennummer: 202289024
-   E-mailadres: sander.wauters@student.hogent.be

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

-   [NodeJS](https://nodejs.org)
-   [Yarn](https://yarnpkg.com)
-   [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Opstarten

Maak eerst het `.env` bestand aan met volgende inhoud.

```
NODE_ENV=development
AUTH_JWT_SECRET=eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked
```

Voor het opstarten van het project, voer de volgende commandos uit.

-   Installer eerst alle dependencies met `yarn`.
-   Pas `config/database.js` aan aan je eigen databank.
-   Start de server in development met `yarn start`


## Testen

Meen eerst het `.env.test` file aan met volgende inhoud.

```
NODE_ENV=test
AUTH_JWT_SECRET=eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked
```

Voer de testen uit met `yarn test` of `yarn test:coverage`.
