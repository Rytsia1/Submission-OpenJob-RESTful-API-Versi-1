// dikerjakan oleh: distania_9

const { nanoid } = require('nanoid');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class JobsService {
  constructor() {
    this._pool = pool;
  }

  async verifyCompanyExists(companyId) {
    const query = {
      text: 'SELECT id FROM companies WHERE id = $1',
      values: [companyId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Company tidak ditemukan');
    }
  }

  async verifyCategoryExists(categoryId) {
    const query = {
      text: 'SELECT id FROM categories WHERE id = $1',
      values: [categoryId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Category tidak ditemukan');
    }
  }

  async addJob({
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible = true,
    status = 'open',
  }) {
    await this.verifyCompanyExists(company_id);
    await this.verifyCategoryExists(category_id);

    const id = `job-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO jobs (
        id, company_id, category_id, title, description, job_type,
        experience_level, location_type, location_city, salary_min,
        salary_max, is_salary_visible, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id`,
      values: [
        id,
        company_id,
        category_id,
        title,
        description || null,
        job_type,
        experience_level,
        location_type,
        location_city || null,
        salary_min !== undefined ? salary_min : null,
        salary_max !== undefined ? salary_max : null,
        is_salary_visible !== undefined ? is_salary_visible : true,
        status || 'open',
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Job gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getJobs({ title, companyName } = {}) {
    let text = `
      SELECT jobs.id, jobs.company_id, jobs.category_id, jobs.title, jobs.description,
             jobs.job_type, jobs.experience_level, jobs.location_type, jobs.location_city,
             jobs.salary_min, jobs.salary_max, jobs.is_salary_visible, jobs.status,
             jobs.created_at, jobs.updated_at,
             companies.name AS company_name,
             categories.name AS category_name
      FROM jobs
      LEFT JOIN companies ON companies.id = jobs.company_id
      LEFT JOIN categories ON categories.id = jobs.category_id
      WHERE 1=1
    `;
    const values = [];

    if (title && title.trim() !== '') {
      values.push(`%${title.trim()}%`);
      text += ` AND jobs.title ILIKE $${values.length}`;
    }

    if (companyName && companyName.trim() !== '') {
      values.push(`%${companyName.trim()}%`);
      text += ` AND companies.name ILIKE $${values.length}`;
    }

    text += ' ORDER BY jobs.created_at DESC';

    const result = await this._pool.query({ text, values });
    return result.rows;
  }

  async getJobsByCompanyId(companyId) {
    const query = {
      text: `
        SELECT jobs.id, jobs.company_id, jobs.category_id, jobs.title, jobs.description,
               jobs.job_type, jobs.experience_level, jobs.location_type, jobs.location_city,
               jobs.salary_min, jobs.salary_max, jobs.is_salary_visible, jobs.status,
               jobs.created_at, jobs.updated_at,
               companies.name AS company_name,
               categories.name AS category_name
        FROM jobs
        LEFT JOIN companies ON companies.id = jobs.company_id
        LEFT JOIN categories ON categories.id = jobs.category_id
        WHERE jobs.company_id = $1
        ORDER BY jobs.created_at DESC
      `,
      values: [companyId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getJobsByCategoryId(categoryId) {
    const query = {
      text: `
        SELECT jobs.id, jobs.company_id, jobs.category_id, jobs.title, jobs.description,
               jobs.job_type, jobs.experience_level, jobs.location_type, jobs.location_city,
               jobs.salary_min, jobs.salary_max, jobs.is_salary_visible, jobs.status,
               jobs.created_at, jobs.updated_at,
               companies.name AS company_name,
               categories.name AS category_name
        FROM jobs
        LEFT JOIN companies ON companies.id = jobs.company_id
        LEFT JOIN categories ON categories.id = jobs.category_id
        WHERE jobs.category_id = $1
        ORDER BY jobs.created_at DESC
      `,
      values: [categoryId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: `
        SELECT jobs.id, jobs.company_id, jobs.category_id, jobs.title, jobs.description,
               jobs.job_type, jobs.experience_level, jobs.location_type, jobs.location_city,
               jobs.salary_min, jobs.salary_max, jobs.is_salary_visible, jobs.status,
               jobs.created_at, jobs.updated_at,
               companies.name AS company_name,
               categories.name AS category_name
        FROM jobs
        LEFT JOIN companies ON companies.id = jobs.company_id
        LEFT JOIN categories ON categories.id = jobs.category_id
        WHERE jobs.id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    return result.rows[0];
  }

  async editJobById(id, {
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
    status,
  }) {
    if (company_id) await this.verifyCompanyExists(company_id);
    if (category_id) await this.verifyCategoryExists(category_id);

    const query = {
      text: `
        UPDATE jobs
        SET company_id = COALESCE($1, company_id),
            category_id = COALESCE($2, category_id),
            title = COALESCE($3, title),
            description = COALESCE($4, description),
            job_type = COALESCE($5, job_type),
            experience_level = COALESCE($6, experience_level),
            location_type = COALESCE($7, location_type),
            location_city = COALESCE($8, location_city),
            salary_min = COALESCE($9, salary_min),
            salary_max = COALESCE($10, salary_max),
            is_salary_visible = COALESCE($11, is_salary_visible),
            status = COALESCE($12, status),
            updated_at = current_timestamp
        WHERE id = $13
        RETURNING id
      `,
      values: [
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city,
        salary_min,
        salary_max,
        is_salary_visible,
        status,
        id,
      ],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Gagal memperbarui job. Id tidak ditemukan');
    }
  }

  async deleteJobById(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Gagal menghapus job. Id tidak ditemukan');
    }
  }
}

module.exports = JobsService;
