'use strict'

const {
    StatusCode,
    ReasonPhrases
} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT,statusCode=StatusCode.CONFLICT)  {  
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN,statusCode=StatusCode.FORBIDDEN)  {
        super(message, statusCode);
    }
}

class AuthFailedError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED,statusCode=StatusCode.UNAUTHORIZED)  {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
}