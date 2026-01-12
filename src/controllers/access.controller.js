'use strict'

const AccessService = require("../services/access.service")

const { OK, CREATED } = require("../core/success.response")

class AccessController {
    signUp = async (req, res, next) => {
            console.log(`[P]::signUp::`, req.body)
            new CREATED({
                message: 'User created successfully',
                metadata: await AccessService.signup(req.body)
            }).send(res)
    }
}

module.exports = new AccessController()