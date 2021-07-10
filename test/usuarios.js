/* eslint-disable no-undef */
require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

chai.use(chaiHttp);

const baseUrl = process.env.BASE_URL;

describe('Users', () => {
  const firstNames = ['Paulo', 'Dirceu', 'Rogerio', 'Jorge'];
  const lastNames = ['da Silva', 'Junior', 'Pereira', 'dos Santos'];
  const email = `teste${new Date().getTime()}@gmail.com`;

  describe('/POST Users', () => {
    it('Cadastro de usuario', (done) => {
      const usuario = {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        email,
        password: '21314',
      };

      chai.request(baseUrl)
        .post('/api/users')
        .send(usuario)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message').eql('Usuario cadastrado com sucesso');
          done();
        });
    });
    it('Cadastro de usuario com email já existente', (done) => {
      const usuario = {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        email,
        password: '3423',
      };
      chai.request(baseUrl)
        .post('/api/users')
        .send(usuario)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          done();
        });
    });
  });

  describe('/GET Users', () => {
    it('Listando usuarios sem query', (done) => {
      chai.request(baseUrl)
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.to.have.lengthOf.at.most(10);
          done();
        });
    });
    it('Listando usuarios com query', (done) => {
      chai.request(baseUrl)
        .get('/api/users')
        .query({
          page: 0,
          pageSize: 5,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.to.have.lengthOf.at.most(5);
          done();
        });
    });
  });

  describe('/GET/:id User', () => {
    it('GET usuario por ID', (done) => {
      const id = 1;
      chai.request(baseUrl)
        .get(`/api/users/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id').eql(id);
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
          done();
        });
    });

    it('GET usuario por ID inválido', (done) => {
      const id = 431;
      chai.request(baseUrl)
        .get(`/api/users/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('errors');
          done();
        });
    });
  });

  describe('/PUT/:id User', () => {
    it('PUT usuario por ID', (done) => {
      const id = 1;

      const usuario = {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      };

      chai.request(baseUrl)
        .put(`/api/users/${id}`)
        .send(usuario)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id').eql(id);
          res.body.should.have.property('firstName').eql(usuario.firstName);
          res.body.should.have.property('lastName').eql(usuario.lastName);
          done();
        });
    });

    it('PUT usuario por ID invalido', (done) => {
      const id = 'A39';
      const usuario = {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      };

      chai.request(baseUrl)
        .put(`/api/users/${id}`)
        .send(usuario)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          done();
        });
    });
  });
});
