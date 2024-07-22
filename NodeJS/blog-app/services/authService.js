const UserRepository = require("../repositories/userRepository");
const {
  APIError,
  STATUS_CODES,
} = require("../utils/appError").default.default;
const auth = require("../utils/signToken");
const genSalt = require("../utils/generateSalt");
const bcrypt = require("bcryptjs");

class AuthService {
  constructor() {
    this.repository = new UserRepository();
  }

  async SignUp(user) {
    const { name, email, password } = user;
    try {
      const oldUser = await this.repository.FindUser(email);
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
        userId: user._id,
        salt: salt,
      });
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async SignIn(user) {
    const { email, password } = user;
    try {
      const user = await this.repository.FindUser(email);
      if (!user) {
        throw new APIError("User Not Found", STATUS_CODES.NOT_FOUND);
      }
      const salt = await this.repository.FindSalt(user._id);
      if (!salt) {
        throw new APIError("Salt Not Found", STATUS_CODES.NOT_FOUND);
      }
      const enteredEncryptedPassword = await bcrypt.hash(password, salt.salt);
      const storedEncryptedPassword = user.password;
      if (enteredEncryptedPassword !== storedEncryptedPassword) {
        throw new APIError("Invalid Password", STATUS_CODES.NOT_FOUND);
      }
      const token = auth.signToken({ id: user._id });
      return { token: token };
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }
}

module.exports = AuthService;
