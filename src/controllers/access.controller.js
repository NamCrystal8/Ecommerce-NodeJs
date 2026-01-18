'use strict'

const AccessService = require("../services/access.service")

const { OK, CREATED, SuccessResponse } = require("../core/success.response")

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'User logged in successfully',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
            new CREATED({
                message: 'User created successfully',
                metadata: await AccessService.signup(req.body),
                options: {
                    limit: 10
                }
            }).send(res)
    }
    logout = async (req, res, next) => {
        new OK({
            message: 'User logged out successfully',
            metadata: await AccessService.logout({
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

module.exports = new AccessController()