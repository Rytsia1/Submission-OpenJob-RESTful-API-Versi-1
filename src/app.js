// dikerjakan oleh: distania_9

require('dotenv').config();
const express = require('express');

// Exception & Middleware
const NotFoundError = require('./exceptions/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');

// Token Manager
const TokenManager = require('./tokenize/TokenManager');

// Services
const UsersService = require('./services/UsersService');
const AuthenticationsService = require('./services/AuthenticationsService');
const CompaniesService = require('./services/CompaniesService');
const CategoriesService = require('./services/CategoriesService');
const JobsService = require('./services/JobsService');
const ApplicationsService = require('./services/ApplicationsService');
const BookmarksService = require('./services/BookmarksService');

// Controllers
const UsersController = require('./controllers/UsersController');
const AuthenticationsController = require('./controllers/AuthenticationsController');
const CompaniesController = require('./controllers/CompaniesController');
const CategoriesController = require('./controllers/CategoriesController');
const JobsController = require('./controllers/JobsController');
const ApplicationsController = require('./controllers/ApplicationsController');
const BookmarksController = require('./controllers/BookmarksController');
const ProfilesController = require('./controllers/ProfilesController');

// Routers
const createUsersRouter = require('./routes/users');
const createAuthenticationsRouter = require('./routes/authentications');
const createCompaniesRouter = require('./routes/companies');
const createCategoriesRouter = require('./routes/categories');
const createJobsRouter = require('./routes/jobs');
const createApplicationsRouter = require('./routes/applications');
const createBookmarksRouter = require('./routes/bookmarks');
const createProfilesRouter = require('./routes/profiles');

const createApp = () => {
  const app = express();

  app.use(express.json());

  // Instantiate Services
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const companiesService = new CompaniesService();
  const categoriesService = new CategoriesService();
  const jobsService = new JobsService();
  const applicationsService = new ApplicationsService();
  const bookmarksService = new BookmarksService();

  // Instantiate Controllers
  const usersController = new UsersController(usersService);
  const authenticationsController = new AuthenticationsController(
    authenticationsService,
    usersService,
    TokenManager
  );
  const companiesController = new CompaniesController(companiesService);
  const categoriesController = new CategoriesController(categoriesService);
  const jobsController = new JobsController(jobsService);
  const applicationsController = new ApplicationsController(applicationsService);
  const bookmarksController = new BookmarksController(bookmarksService);
  const profilesController = new ProfilesController(usersService, applicationsService, bookmarksService);

  // Mount Routes
  app.use('/users', createUsersRouter(usersController));
  app.use('/authentications', createAuthenticationsRouter(authenticationsController));
  app.use('/companies', createCompaniesRouter(companiesController));
  app.use('/categories', createCategoriesRouter(categoriesController));
  app.use('/jobs', createJobsRouter(jobsController, bookmarksController));
  app.use('/applications', createApplicationsRouter(applicationsController));
  app.use('/bookmarks', createBookmarksRouter(bookmarksController));
  app.use('/profile', createProfilesRouter(profilesController));

  // Catch undefined routes
  app.use((req, res, next) => {
    next(new NotFoundError('Resource tidak ditemukan'));
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
