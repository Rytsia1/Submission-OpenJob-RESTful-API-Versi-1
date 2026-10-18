// dikerjakan oleh: distania_9

exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"companies"',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"categories"',
      onDelete: 'CASCADE',
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    description: {
      type: 'TEXT',
      notNull: false,
    },
    job_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    experience_level: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    location_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    location_city: {
      type: 'VARCHAR(100)',
      notNull: false,
    },
    salary_min: {
      type: 'BIGINT',
      notNull: false,
    },
    salary_max: {
      type: 'BIGINT',
      notNull: false,
    },
    is_salary_visible: {
      type: 'BOOLEAN',
      notNull: true,
      default: true,
    },
    status: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: 'open',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('jobs', 'company_id');
  pgm.createIndex('jobs', 'category_id');
  pgm.createIndex('jobs', 'title');
};

exports.down = (pgm) => {
  pgm.dropTable('jobs');
};
