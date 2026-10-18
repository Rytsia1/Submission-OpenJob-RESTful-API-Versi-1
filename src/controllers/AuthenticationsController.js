// dikerjakan oleh: distania_9

class AuthenticationsController {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req, res, next) {
    try {
      this._validator.validatePostAuthenticationPayload(req.body);

      const { email, password } = req.body;
      const user = await this._usersService.verifyUserCredential(email, password);

      const tokenPayload = {
        id: user.id,
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      };

      const accessToken = this._tokenManager.generateAccessToken(tokenPayload);
      const refreshToken = this._tokenManager.generateRefreshToken(tokenPayload);

      await this._authenticationsService.addRefreshToken(refreshToken);

      return res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthenticationHandler(req, res, next) {
    try {
      this._validator.validatePutAuthenticationPayload(req.body);

      const { refreshToken } = req.body;

      // Verify signature first (throws InvariantError if invalid)
      const decoded = this._tokenManager.verifyRefreshToken(refreshToken);

      // Verify token exists in database (throws InvariantError if not found)
      await this._authenticationsService.verifyRefreshToken(refreshToken);

      const tokenPayload = {
        id: decoded.id,
        userId: decoded.id,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
      };

      const accessToken = this._tokenManager.generateAccessToken(tokenPayload);

      return res.status(200).json({
        status: 'success',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationHandler(req, res, next) {
    try {
      this._validator.validateDeleteAuthenticationPayload(req.body);

      const { refreshToken } = req.body;

      // Verify signature first (throws InvariantError if invalid)
      this._tokenManager.verifyRefreshToken(refreshToken);

      // Delete token from database
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return res.status(200).json({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthenticationsController;
