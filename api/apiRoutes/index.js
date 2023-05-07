const { Router } = require('express');
const router = Router();
const passport = require('passport');

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * tags:
 *   - name: Authentication
 *     description: Api authentication routes.
 *   - name: Users
 *     description: Api users routes.
 *   - name: Products
 *     description: Api products routes.
 *   - name: Produce
 *     description: Api produce routes.
 *   - name: Harvests
 *     description: Api harvests routes.
 *   - name: Sales
 *     description: Api sales routes.
 *   - name: Documents
 *     description: Api documents routes.
 *   - name: Archives
 *     description: Api archives routes.
 *   - name: Files
 *     description: Api files routes.
 *   - name: Announcements
 *     description: Api announcements routes.
 */
router.use('/authentication', require('./authentication'));
router.use(
  '/users',
  passport.authenticate('jwt', { session: false }),
  require('./users')
);
router.use(
  '/sales',
  passport.authenticate('jwt', { session: false }),
  require('./sales')
);
router.use(
  '/products',
  passport.authenticate('jwt', { session: false }),
  require('./products')
);
router.use(
  '/produce',
  passport.authenticate('jwt', { session: false }),
  require('./produce')
);
router.use(
  '/harvests',
  passport.authenticate('jwt', { session: false }),
  require('./harvests')
);
router.use(
  '/analytics',
  passport.authenticate('jwt', { session: false }),
  require('./analytics')
);
router.use('/documents', require('./documents'));
router.use('/archives', require('./archive'));
router.use('/files', require('./files'));
router.use('/announcements', require('./announcements'));
router.use('/surveys', require('./surveys'));

module.exports = router;
