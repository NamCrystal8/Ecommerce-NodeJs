'use strict'

const findByEmail = async ({enail, select = {
    email: 1, password: 1, role: 1, status: 1, roles: 1
}}) => {
    return await shopModel.findOne({email}).select(select).lean()
}