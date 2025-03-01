class ApiResponse {
    constructor(statusCode, data = null, message = "Success") {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };



// ApiResponse class is a great way to standardize
//  API responses in an Express.js application. 
// It ensures that all responses follow a consistent
//  structure.