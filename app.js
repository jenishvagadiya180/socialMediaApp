import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './config/connection.js';
import errorhandler from './error/handler.js'
import user from './routes/user.js';
import post from './routes/post.js';
import postInteractions from './routes/postInteractions.js'
import fileUpload from 'express-fileupload';

dotenv.config();
const app = express();
const port = process.env.PORT;

//Database Connection
connectDatabase();

app.use(express.json())
app.use(fileUpload());
app.use("/user", user);
app.use("/post", post);
app.use("/postInteractions", postInteractions);
app.use(errorhandler)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})