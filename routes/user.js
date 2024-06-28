import express from "express";
const router = express.Router();
import user from '../controllers/user.js';
import { body } from 'express-validator';
import message from "../helper/message.js";


router.post("/addUser",
    [
        body("userName").exists().isLength({ min: 2 }).withMessage(message.INVALID_USER_NAME),
        body("name").exists().isLength({ min: 2 }).withMessage(message.INVALID_NAME),
        body("email").exists().isEmail().withMessage(message.INVALID_EMAIL),
        body("password").exists().isLength({ min: 8 }).withMessage(message.INVALID_PASSWORD),
        body("gender").exists().withMessage(message.INVALID_GENDER),
    ]
    , user.addUser);

router.post("/login",
    [
        body("email").exists().isEmail().withMessage(message.INVALID_EMAIL),
        body("password").exists().isLength({ min: 8 }).withMessage(message.INVALID_PASSWORD)
    ]
    , user.userLogin);

export default router;