import express from 'express';
import AuthController from '../controllers/authController.js';
import { refreshAccessToken } from '../services/authService.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const newAccessToken = await refreshAccessToken(refreshToken);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});

export default router;
