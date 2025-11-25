import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';

const AuthController = () => import('#controllers/auth_controller');

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
		router.on('/').renderInertia('home');
		router.get('/logout', [AuthController, 'logout']);
	})
	.use(middleware.auth());
