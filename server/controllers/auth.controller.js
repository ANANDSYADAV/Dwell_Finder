import prisma from '../library/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // HASHING THE PASSWORD
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log(hashedPassword);

        // CREAT A NEW USER AND SAVE TO DB
        const newUser = await prisma.User.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        })

        console.log(newUser);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create user' });
    }

}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // CHECK IF USER EXISTS
        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            return res.status(401).json({ message: 'Invalid Credetials!' });
        }

        // CHECK IF PASSWORD CORRECT

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credetials!' });
        }

        // GENERATE COOKIE TOKEN AND SEND TO USER
        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 86400000) }); // 1 day
        res.json({ message: 'Logged in successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to login' });

    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: 'Logout Successful' });
}