// dikerjakan oleh: distania_9

class BookmarksController {
  constructor(bookmarksService) {
    this._bookmarksService = bookmarksService;

    this.postBookmarkHandler = this.postBookmarkHandler.bind(this);
    this.getBookmarksHandler = this.getBookmarksHandler.bind(this);
    this.getBookmarkByIdHandler = this.getBookmarkByIdHandler.bind(this);
    this.deleteBookmarkHandler = this.deleteBookmarkHandler.bind(this);
  }

  async postBookmarkHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id || req.user.userId;

      const bookmarkId = await this._bookmarksService.addBookmark(userId, jobId);

      return res.status(201).json({
        status: 'success',
        data: {
          id: bookmarkId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarksHandler(req, res, next) {
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

  async getBookmarkByIdHandler(req, res, next) {
    try {
      const { jobId, bookmarkId } = req.params;
      const bookmark = await this._bookmarksService.getBookmarkById(jobId, bookmarkId);

      return res.status(200).json({
        status: 'success',
        data: bookmark,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBookmarkHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id || req.user.userId;

      await this._bookmarksService.deleteBookmark(userId, jobId);

      return res.status(200).json({
        status: 'success',
        message: 'Bookmark berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BookmarksController;
