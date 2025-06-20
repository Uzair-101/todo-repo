import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';


export const registerUser = async (email, password) => {
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });
    return {
        accessToken: generateAccessToken(newUser._id),
        refreshToken: generateRefreshToken(newUser._id),
    };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    return {
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
    };
};

export const refreshAccessToken = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    return generateAccessToken(decoded.id);
};