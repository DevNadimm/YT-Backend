import { asyncHandler } from "../utils/async_handler.js";

const registerUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        message: "Ok!",
    });
})

export { registerUser };
