import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';

const AuthController = () => import('#controllers/auth_controller');
const HomeController = () => import('#controllers/home_controller');
const BotsController = () => import('#controllers/bots_controller');

router
	.group(() => {
		router.get('/login', [AuthController, 'showLogin']);
		router.post('/login', [AuthController, 'login']);
		router.get('/register', [AuthController, 'showRegister']);
		router.post('/register', [AuthController, 'register']);
	})
	.use(middleware.guest());

router
	.group(() => {
		router.get('/', [HomeController, 'index']);
		router.get('/logout', [AuthController, 'logout']);

		router.post('/bots', [BotsController, 'create']);
		router.put('/bots/:id', [BotsController, 'update']);
		router.delete('/bots/:id', [BotsController, 'destroy']);
	})
	.use(middleware.auth());
