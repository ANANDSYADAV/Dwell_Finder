import express from 'express';
import cookieParser from 'cookie-parser';
import postRoute from './routes/post.route.js'
import authRouter from './routes/auth.route.js'

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/posts', postRoute);

app.use('/api/auth', authRouter);

const PORT = 8000;
app.listen(PORT, () => console.log('Runing at port 8000'));