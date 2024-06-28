import userModel from "../models/user.js";
import services from "../helper/services.js";
import message from "../helper/message.js";
import statusCode from "../helper/httpStatusCode.js";
import imageModel from "../models/image.js";
import bcrypt from 'bcrypt';
const saltRounds = 10;

const send = services.setResponse;

class user {

  /**
   * This function for add user
   * @param {*} req.body.userName
   * @param {*} req.body.name   
   * @param {*} req.body.email
   * @param {*} req.body.password
   * @param {*} req.body.gender
   * @param {*} req.body.bio
   * @returns id
   */
  static addUser = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      let matchEmail = await userModel.findOne({ email: req.body.email });
      if (matchEmail) {
        return send(
          res,
          statusCode.NOT_FOUND,
          message.USER_ALREADY_EXISTS,
          null
        );
      }

      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      const user = new userModel({
        userName: req.body.userName,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        gender: req.body.gender,
        bio: req.body.bio ? req.body.bio : ""
      });


      if (!req.files || Object.keys(req.files).length === 0) {
        return send(
          res,
          statusCode.REQUIRED_CODE,
          message.PROFILE_PICTURE_IS_REQUIRED,
          null
        );
      }

      const userData = await user.save();
      let saveImage = services.imageUploader(req.files.image, null, userData._id, "Profile");

      await imageModel.insertMany(saveImage);

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_REGISTERED, {
        _id: userData._id,
      });
    } catch (error) {
      console.log("error.message :>> ", error.message);
      next(error);
    }
  };

  /**
   * This function for user login
   * @param {*} req.body.email
   * @param {*} req.body.password
   * @returns res
   */
  static userLogin = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const userData = await userModel.findOne({ email: req.body.email, isDeleted: false });
      if (!userData) {
        return send(res, 400, "Invalid Email", null);
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, userData.password);
      if (isPasswordValid) {
        const token = await services.userTokenGenerate({ email: req.body.email, _id: userData._id }, process.env.EXPIRE_TIME);

        const userObj = {
          userName: userData.userName,
          id: userData._id,
          token: token
        };
        return send(res, 200, "Login Successful", userObj);
      } else {
        return send(res, 400, "Invalid Password", null);
      }
    } catch (error) {
      console.log("error.message :>> ", error.message);
      next(error);
    }
  }
}

export default user;
