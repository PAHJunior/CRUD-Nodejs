const {
  Model,
} = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {}

  Users.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Informe o primeiro nome',
        },
      },
    },
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'O email informado já existe.',
      },
      validate: {
        isEmail: true,
      },
    },
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Users',
  });

  Users.beforeCreate(async (user) => {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;
  });

  Users.beforeBulkUpdate(async (user) => {
    if (user.attributes.password) {
      const salt = bcrypt.genSaltSync();
      const hashedPassword = await bcrypt.hashSync(user.attributes.password, salt);
      user.password = hashedPassword;
    }
  });

  return Users;
};
