// dikerjakan oleh: distania_9

class ProfilesController {
  constructor(usersService, applicationsService, bookmarksService) {
    this._usersService = usersService;
    this._applicationsService = applicationsService;
    this._bookmarksService = bookmarksService;

    this.getProfileHandler = this.getProfileHandler.bind(this);
    this.getProfileApplicationsHandler = this.getProfileApplicationsHandler.bind(this);
    this.getProfileBookmarksHandler = this.getProfileBookmarksHandler.bind(this);
  }

  async getProfileHandler(req, res, next) {
    try {
      const userId = req.user.id || req.user.userId;
      const user = await this._usersService.getUserById(userId);

      return res.status(200).json({
        status: 'success',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileApplicationsHandler(req, res, next) {
    try {
      const userId = req.user.id || req.user.userId;
      const applications = await this._applicationsService.getApplicationsByUserId(userId);

      return res.status(200).json({
        status: 'success',
        data: {
          applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileBookmarksHandler(req, res, next) {
    try {
      const userId = req.user.id || req.user.userId;
      const bookmarks = await this._bookmarksService.getBookmarks(userId);

      return res.status(200).json({
        status: 'success',
        data: {
          bookmarks,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProfilesController;
