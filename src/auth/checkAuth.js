'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const { findById } = require('../services/apikey.service')

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden. API key is missing'
            })
        }
        //check objKey
        const objKey = await findById(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden. API key is invalid'
            })
        }
        req.apiKey = objKey
        next()
    } catch (error) {
        console.error('Error in apiKey middleware:', error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.apiKey.permissions) {
            return res.status(403).json({
                message: 'Forbidden. Permissions missing'
            })
        }
        const validPermission = req.apiKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                message: 'Forbidden. Invalid permission'
            })
        }
        return next()
    }
}

module.exports = {
    apiKey,
    permission
}