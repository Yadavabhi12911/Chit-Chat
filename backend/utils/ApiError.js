
class ApiError extends Error {
    constructor(statusCode, message, success) {
        super()
        this.success = success || false,
            this.statusCode = statusCode,
            this.message = message
    }
}


export default ApiError