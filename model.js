const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;

const Database = require("./database");
const { database, host, password, user } = Database;

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'postgres',
  logging: false
})

class User extends Model {
  isPasswordValid(password) {
    return bcrypt.compare(password, this.password)
  }
}

User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user',
  timestamps: false,
  hooks: {
    beforeCreate: async user => {
      const saltRounds = 10
      const salt = await bcrypt.genSalt(saltRounds)
      user.password = await bcrypt.hash(user.password, salt)
    }
  }
})

exports.User = User
exports.sequelize = sequelize