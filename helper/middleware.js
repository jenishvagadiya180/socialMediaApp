import services from "../helper/services.js";
import statusCode from "../helper/httpStatusCode.js";
import message from "../helper/message.js";
import { jwtDecode } from "jwt-decode";
import userModel from "../models/user.js";
import mongoose from "mongoose";


const auth = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;

    if (!headerToken) {
      return res.status(statusCode.UNAUTHORIZED).send(services.response(statusCode.UNAUTHORIZED, message.UNAUTHORIZED, null));
    }
    const token = headerToken.split(' ')[1];
    const verify = services.jwtVerify(token);

    const userData = await userModel.findOne({ _id: verify._id })
    req.user = userData
    next();
  }
  catch (error) {
    console.log('error.message :>> ', error.message);
    next(error)
  }
}


export default auth;