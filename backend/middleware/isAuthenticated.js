import jwt from "jsonwebtoken";
import User from "../modules/usermodel.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Token Not Found" });
        }

        const decoded = jwt.verify(token, process.env.gen_secret);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "User Not Found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};
