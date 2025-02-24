const asyncHandler = (fn) => { 
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export { asyncHandler };


// This is an alternative option

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };
