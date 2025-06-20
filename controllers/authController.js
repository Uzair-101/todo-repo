import { registerUser, loginUser } from '../services/authService.js';

class AuthController {
    static async register(req, res) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await registerUser(email, password);
            res.status(201).json({ accessToken, refreshToken });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await loginUser(email, password);
            res.status(200).json({ accessToken, refreshToken });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

export default AuthController;
