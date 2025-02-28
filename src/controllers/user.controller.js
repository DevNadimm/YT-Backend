import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken,
        }
    } catch (error) {
        throw new ApiError(500, "An error occurred while generating refresh and access tokens.");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    
    // TODOS:
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user obj - create entry in db
    // remove password and refresh token field from response
    // check user creation 
    // return response

    const { username, fullName, email, password } = req.body;

    if (!fullName?.trim() || !username?.trim() || !email?.trim() || !password?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    };

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    };

    if(!avatar) {
        throw new ApiError(500, "Failed to upload avatar file");
    };

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    
    let coverImage = "";
    if(coverImageLocalPath){
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
});

const loginUser = asyncHandler(async (req, res) => {

    // TODOS: 
    // req body -> data
    // username, email validation
    // find the user
    // password check
    // access and refresh token generate
    // send cookies or response

    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Either username or email is required.");
    }

    if(!password) {
        throw new ApiError(400, "Password is required.");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) {
        throw new ApiError(404, "The requested user does not exist.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, 
            { user: loggedInUser, accessToken, refreshToken }, 
            "User logged in successfully"
        )
    );
})

export {
    registerUser,
    loginUser,
};
