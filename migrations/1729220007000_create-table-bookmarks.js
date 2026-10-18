// dikerjakan oleh: distania_9

exports.up = (pgm) => {
  pgm.createTable('bookmarks', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"jobs"',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('bookmarks', 'unique_user_id_and_job_id', {
    unique: ['user_id', 'job_id'],
  });

  pgm.createIndex('bookmarks', 'user_id');
  pgm.createIndex('bookmarks', 'job_id');
};

exports.down = (pgm) => {
  pgm.dropTable('bookmarks');
};
