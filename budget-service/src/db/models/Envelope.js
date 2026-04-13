module.exports = (sequelize, DataTypes) => {
  const Envelope = sequelize.define('envelope', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("title", value.trim().toLowerCase());
      }
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Envelope;
};