// dikerjakan oleh: distania_9

const { nanoid } = require('nanoid');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class BookmarksService {
  constructor() {
    this._pool = pool;
  }

  async verifyJobExists(jobId) {
    const query = {
      text: 'SELECT id FROM jobs WHERE id = $1',
      values: [jobId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Job tidak ditemukan');
    }
  }

  async addBookmark(userId, jobId) {
    await this.verifyJobExists(jobId);

    // Check if already bookmarked
    const checkQuery = {
      text: 'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
      values: [userId, jobId],
    };
    const checkResult = await this._pool.query(checkQuery);
    if (checkResult.rows.length > 0) {
      return checkResult.rows[0].id;
    }

    const id = `bookmark-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, jobId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Bookmark gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getBookmarks(userId) {
    const query = {
      text: `
        SELECT bookmarks.id, bookmarks.user_id, bookmarks.job_id, bookmarks.created_at,
               jobs.title AS job_title, jobs.job_type, jobs.location_city,
               companies.name AS company_name
        FROM bookmarks
        LEFT JOIN jobs ON jobs.id = bookmarks.job_id
        LEFT JOIN companies ON companies.id = jobs.company_id
        WHERE bookmarks.user_id = $1
        ORDER BY bookmarks.created_at DESC
      `,
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getBookmarkById(jobId, bookmarkId) {
    const query = {
      text: `
        SELECT bookmarks.id, bookmarks.user_id, bookmarks.job_id, bookmarks.created_at,
               jobs.title AS job_title,
               companies.name AS company_name
        FROM bookmarks
        LEFT JOIN jobs ON jobs.id = bookmarks.job_id
        LEFT JOIN companies ON companies.id = jobs.company_id
        WHERE bookmarks.id = $1 AND bookmarks.job_id = $2
      `,
      values: [bookmarkId, jobId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteBookmark(userId, jobId) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
      values: [userId, jobId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Gagal menghapus bookmark. Bookmark tidak ditemukan');
    }
  }
}

module.exports = BookmarksService;
