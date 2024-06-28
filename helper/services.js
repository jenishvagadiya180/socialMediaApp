import jwt from "jsonwebtoken";
import statusCode from "./httpStatusCode.js";
import { validationResult } from "express-validator";
import moment from "moment";
import fs from "fs";


class services {
  static response = (code, message, data) => {
    if (data == null) {
      return {
        status: code,
        message: message,
      };
    } else {
      return {
        status: code,
        message: message,
        responseData: data,
      };
    }
  };

  static hasValidatorErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let msg = "Validation Failed";
      this.setResponse(res, statusCode.REQUIRED_CODE, msg, errors.array());
      return true;
    } else {
      return false;
    }
  };

  static userTokenGenerate = async (payload, expireTime) => {
    const token = jwt.sign(payload, process.env.SECURITY_KEY, {
      expiresIn: expireTime,
    });
    return token;
  };

  static jwtVerify(token) {
    try {
      const verifyUser = jwt.verify(token, process.env.SECURITY_KEY);
      return verifyUser;
    } catch (error) {
      throw error;
    }
  }

  static imageUploader = (image, id, userId, imageType) => {
    if (image.length == undefined) {
      image = [image];
    }

    let saveImage = [];
    fs.mkdirSync(`./uploads/${id}/`, { recursive: true });

    image.forEach((index) => {
      let filePath =
        "./uploads/" +
        `${id}/` +
        Math.random().toString().substr(2, 6) +
        moment().unix() +
        index.name;
      index.mv(filePath, function (err) {
        if (err) {
          console.log("err :>> ", err);
        } else {
          console.log("File Uploaded");
        }
      });
      saveImage.push({ postId: id, url: filePath.substr(1), userId: userId, type: imageType });
    });
    return saveImage;
  };

  static setResponse = async (res, statusCode, message, data) => {
    await res.send(this.response(statusCode, message, data));
  };

  static responseData(status, message, data, totalRecord) {
    let responseData = {
      status: status,
      message: message,
      data: data,
      recordsTotal: totalRecord,
      recordsFiltered: totalRecord,
    };
    return responseData;
  }
}

export default services;
