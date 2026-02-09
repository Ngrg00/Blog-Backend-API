const { constant } = require("../constant.js");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode: 500;
    
    switch (statusCode) {
        case constant.VALIDATION_ERROR:
            res.json({ title: "Validation error!", message: err.message, stackTrace: err.stackTrace});
            break;
        
        case constant.UNAUTHORISED:
            res.json({ title: "Unauthorised!", message: err.message, stackTrace: err.stackTrace});
            break;

        case constant.FORBIDDEN:
            res.json({ title: "Forbidden!", message: err.message, stackTrace: err.stackTrace});
            break;

        case constant.NOT_FOUND:
            res.json({ title: "Not found!", message: err.message, stackTrace: err.stackTrace});
            break;

        case constant.SERVER_ERROR:
            res.json({ title: "Validation error!", message: err.message, stackTrace: err.stackTrace});
            break;

        default:
            break;
    }
}

module.exports = errorHandler;