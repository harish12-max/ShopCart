import User from "../modules/usermodel.js";
import bcrypt from "bcrypt";
import gentoken from "../utils/gentoken.js";

const cookieOption = {
  httpOnly: true
};

export const userRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "All Fields Required"
      });
    }

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(409).json({
        message: "Email Already Taken"
      });
    }

    if (password.length <= 8) {
      return res.status(400).json({
        message: "Password should be Strong"
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashpassword,
      phone
    });

    const token = gentoken(newUser._id);

    res.cookie("token", token, cookieOption);

    return res.status(200).json(newUser);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields are Required"
      });
    }

    const emailExist = await User.findOne({ email });

    if (!emailExist) {
      return res.status(404).json({
        message: "User Not Found"
      });
    }

    const hashpassword = await bcrypt.compare(
      password,
      emailExist.password
    );

    if (!hashpassword) {
      return res.status(401).json({
        message: "Invalid Password"
      });
    }

    const token = gentoken(emailExist._id);

    res.cookie("token", token, cookieOption);

    return res.status(200).json({
      message: "Login Successful",
      emailExist
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


export const getUser = async (req, res) => {
  return res.status(200).json(req.user);
};


export const logoutUser = async (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    message: "User Logout"
  });
};