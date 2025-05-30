import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (email, password) => {
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });
    return generateToken(newUser._id);
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    return generateToken(user._id);
};