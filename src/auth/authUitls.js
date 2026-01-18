'use strict'

const JWT = require('jsonwebtoken')
const {asyncHandler} = require('../helper/asyncHandler')
const {AuthFailedError, NotFoundError} = require('../core/error.response')
const keyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    USER_ID: 'x-user-id',
    AUTHORIZATION: 'authorization',
}


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        //refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        //
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('error verify:::', err)
            } else {
                console.log('decode verify:::', decode)
            }
        }
        )
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.USER_ID]
    if (!userId) {
        throw new AuthFailedError('Invalid request')
    }

    const keyStore = await keyTokenService.findByUserId(userId)

    if (!keyStore) {
        throw new NotFoundError('Not found keyStore')
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) {
            throw new AuthFailedError('Invalid user')
        }
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

module.exports = {
    createTokenPair,
    authentication
}