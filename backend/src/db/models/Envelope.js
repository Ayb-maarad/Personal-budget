module.exports = (sequelize, DataTypes) => {
  const Envelope = sequelize.define('envelope', {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("title", value.trim().toLowerCase());
      }

    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 }
    }
  });

  return Envelope;
};