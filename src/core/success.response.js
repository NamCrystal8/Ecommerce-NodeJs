'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created',
}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCCode : message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.statusCode).json( this )
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata = {} } = {}) {
        super({
            message,
            metadata
        });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.CREATED, reasonStatusCCode = ReasonStatusCode.CREATED, metadata = {} } = {}) {
        super({
            message,
            statusCode,
            reasonStatusCCode,
            metadata
        });
    }
}

module.exports = {
    OK,
    CREATED,
}