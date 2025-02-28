import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from "../utils/api_error.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = 
            req.cookies?.accessToken || 
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT);

        const user = await User.findById(decodedTokenInfo?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, error?.message || "Invalid access token"));
    }
});
