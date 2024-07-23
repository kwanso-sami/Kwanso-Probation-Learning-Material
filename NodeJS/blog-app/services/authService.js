const UserRepository = require("../repositories/userRepository");
const { APIError, STATUS_CODES } = require("../utils/appError");
const auth = require("../utils/signToken");
const genSalt = require("../utils/generateSalt");
const bcrypt = require("bcryptjs");

class AuthService {
  constructor() {
    this.repository = new UserRepository();
  }

  async SignUp({ name, email, password }) {
    try {
      const oldUser = await this.repository.FindUserByEmail(email);
      if (oldUser) {
        throw new APIError("User Already Exists.", STATUS_CODES.NOT_FOUND);
      }

      const salt = await genSalt();
      const encryptedPassword = await bcrypt.hash(password, salt);
      const user = await this.repository.CreateUser({
        name,
        email,
        password: encryptedPassword,
      });

      await this.repository.CreateSalt({
        userId: user.id,
        salt: salt,
      });

      const token = auth.signToken({ id: user.id });
      return { accessToken: token };
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async SignIn({ email, password }) {
    try {
      const user = await this.repository.FindUserByEmail(email);

      if (!user) {
        throw new APIError("User Not Found", STATUS_CODES.NOT_FOUND);
      }

      const salt = await this.repository.FindSaltByUserId(user.id);
      if (!salt) {
        throw new APIError("Salt Not Found", STATUS_CODES.NOT_FOUND);
      }

      const enteredEncryptedPassword = await bcrypt.hash(password, salt.salt);
      const storedEncryptedPassword = user.password;
      if (enteredEncryptedPassword !== storedEncryptedPassword) {
        throw new APIError("Invalid Password", STATUS_CODES.NOT_FOUND);
      }
      const token = auth.signToken({ id: user.id });
      return { accessToken: token, name: user.name,email: user.email,id: user.id};
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }
}

module.exports = AuthService;
