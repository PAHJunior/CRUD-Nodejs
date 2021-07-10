Example CRUD Nodejs + Express + Sequelize + SQLite
=========

Getting started
---------------

Download [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows. [Docker Compose](https://docs.docker.com/compose) will be automatically installed. On Linux, make sure you have the latest version of [Compose](https://docs.docker.com/compose/install/). 
---------------

Run in this directory:
```
npx sequelize-cli db:migrate
```

```
docker-compose up
```
The app will be running at [http://localhost:3000](http://localhost:3000)


Run tests:
```
npm tests
```