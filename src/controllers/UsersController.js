// dikerjakan oleh: distania_9

class UsersController {
  constructor(usersService, validator) {
    this._usersService = usersService;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(req, res, next) {
    try {
      this._validator.validateUserPayload(req.body);
      const userId = await this._usersService.addUser(req.body);

      return res.status(201).json({
        status: 'success',
        data: {
          id: userId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this._usersService.getUserById(id);

      return res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
