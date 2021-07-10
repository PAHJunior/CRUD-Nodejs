module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
    });
  },
};
