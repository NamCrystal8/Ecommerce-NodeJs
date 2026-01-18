'use strict'

const keytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })

            // return tokens ? tokens.publicKey : null
            const filter =  {user: userId}, update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken
            }, options = {upsert: true, new: true}
            const token = await keytokenModel.findOneAndUpdate(filter, update, options)

            return token ? token.publicKey : null
        } catch (error) {
            return error
        }
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({_id: id})
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
    }
}

module.exports = KeyTokenService