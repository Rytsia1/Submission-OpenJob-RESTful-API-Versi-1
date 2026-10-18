// dikerjakan oleh: distania_9

const { nanoid } = require('nanoid');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class CategoriesService {
  constructor() {
    this._pool = pool;
  }

  async addCategory({ name }) {
    const id = `category-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO categories (id, name) VALUES ($1, $2) RETURNING id',
      values: [id, name],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Category gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getCategories() {
    const query = {
      text: 'SELECT id, name FROM categories ORDER BY created_at ASC',
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getCategoryById(id) {
    const query = {
      text: 'SELECT id, name FROM categories WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Category tidak ditemukan');
    }

    return result.rows[0];
  }

  async editCategoryById(id, { name }) {
    const query = {
      text: 'UPDATE categories SET name = $1, updated_at = current_timestamp WHERE id = $2 RETURNING id',
      values: [name, id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Gagal memperbarui category. Id tidak ditemukan');
    }
  }

  async deleteCategoryById(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Gagal menghapus category. Id tidak ditemukan');
    }
  }
}

module.exports = CategoriesService;
