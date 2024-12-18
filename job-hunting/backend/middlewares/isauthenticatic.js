import jwt from "jsonwebtoken";

const isauthenticated = async (req, res, next) => {
    try {
        console.log("Checking for token...");

        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log("Token received:", token);

        if (!token) {
            return res.status(401).json({
                message: "No token provided. Unauthorized.",
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        console.log("Decoded Token:", decode);

        req.id = decode.userId;
        next();
    } catch (error) {
        console.error("Error in Authentication Middleware:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token. Unauthorized.",
            success: false
        });
    }
};

export default isauthenticated;