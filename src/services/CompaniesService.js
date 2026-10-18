// dikerjakan oleh: distania_9

const { nanoid } = require('nanoid');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class CompaniesService {
  constructor() {
    this._pool = pool;
  }

  async addCompany({ name, location, description }) {
    const id = `company-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO companies (id, name, location, description) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, name, location, description || null],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Company gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getCompanies() {
    const query = {
      text: 'SELECT id, name, location, description FROM companies ORDER BY created_at ASC',
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getCompanyById(id) {
    const query = {
      text: 'SELECT id, name, location, description FROM companies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Company tidak ditemukan');
    }

    return result.rows[0];
  }

  async editCompanyById(id, { name, location, description }) {
    const query = {
      text: 'UPDATE companies SET name = $1, location = $2, description = $3, updated_at = current_timestamp WHERE id = $4 RETURNING id',
      values: [name, location, description || null, id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Gagal memperbarui company. Id tidak ditemukan');
    }
  }

  async deleteCompanyById(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Gagal menghapus company. Id tidak ditemukan');
    }
  }
}

module.exports = CompaniesService;
