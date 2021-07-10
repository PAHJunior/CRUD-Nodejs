const express = require('express');
const { ValidationError } = require('sequelize');

const app = express();
const { Users, sequelize } = require('./app/models');
const { handleError } = require('./helpers/error');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const paginate = (query, { page, pageSize }) => {
  const offset = page * pageSize;
  const limit = pageSize;

  return {
    ...query,
    offset,
    limit,
  };
};

app.post('/api/users', async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    await Users.create(req.body, {
      transaction,
    });

    await transaction.commit();
    res.status(201).send({
      message: 'Usuario cadastrado com sucesso',
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

app.get('/api/users', async (req, res, next) => {
  try {
    const { page, pageSize } = req.query;

    const users = await Users.findAll(
      paginate(
        {
          attributes: { exclude: ['password'] },
        },
        {
          page: page || 0,
          pageSize: pageSize || 10,
        },
      ),
    );

    if (users.length === 0) {
      throw new ValidationError('404', [
        {
          message: 'Nenhum usuairo encontrado',
        },
      ]);
    }

    res.send(users);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await Users.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new ValidationError('404', [
        {
          message: 'Usuairo não encontrado',
        },
      ]);
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

app.put('/api/users/:id', async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    await Users.update(req.body, {
      where: {
        id,
      },
      transaction,
    });

    const user = await Users.findByPk(id, {
      attributes: { exclude: ['password'] },
      transaction,
    });

    if (!user) {
      throw new ValidationError('400', [
        {
          message: 'Erro ao atualizar',
        },
      ]);
    }

    await transaction.commit();

    res.status(200).send({
      ...user.dataValues,
      message: 'Atualizado com sucesso',
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(3000);
