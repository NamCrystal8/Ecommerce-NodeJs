'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const { createTokenPair } = require("../auth/authUitls")
const KeyTokenService = require("./keyToken.service")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailedError } = require("../core/error.response")

//service

const { findByEmail } = require("./shop.service")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '0001',
    EDITOR: '0002',
    ADMIN : 'ADMIN'
}

class AccessService {

    static logout = async ({keyStore}) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }

    /*
        1 - Check mail in Dbs
        2 - match password
        3 - create accessToken, refreshToken
        4 - generate tokens
        5 - get data return login
    */

    static login = async( {email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        if (!foundShop) {
            throw new BadRequestError('Shop not registered')
        }

        const match = bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailedError('Authentication failed')
        }

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const tokens = await createTokenPair(
            {userId: foundShop._id, email},
            publicKey,
            privateKey
        )

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey,
            userId: foundShop._id
        })

        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }

    }

    static signup = async ({name, email, password}) => {
            const holderShop = await shopModel.findOne({email}).lean()
            if (holderShop) {
                throw new BadRequestError('Shop already registered')
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            if (newShop) {
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                // })

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                const Keystore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey,
                    privateKey: privateKey
                })

                if(!Keystore) {
                    return {
                        code: 'xxxx',
                        message: 'publickKeyStringError',
                    }
                }

                const tokens = await createTokenPair(
                    {userId: newShop._id, email},
                    publicKey,
                    privateKey
                )

                console.log("created shop successfully", tokens)

                return {
                    code: '201',
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: '200',
                metadata: null
            }

    }
}

module.exports = AccessService