'use strict';
const { ERRORS_STRINGS } = require('../../../config/functions/errors/erros.js')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    validateUser: async ({ name, lastname, dni, email, phone, token, referrals, promotion }) => {
        const searchUser = strapi.services.participants.findOne
        if (name == null || name.length < 2) {
            const e = new Error(ERRORS_STRINGS.NAME_ERROR_MESSAGE)
            e.type = ERRORS_STRINGS.NAME_ERROR_TYPE
            throw e
        } else if (lastname == null || lastname.length < 2) {
            const e = new Error(ERRORS_STRINGS.LASTNAME_ERROR_MESSAGE)
            e.type = ERRORS_STRINGS.LASTNAME_ERROR_TYPE
            throw e
        } else if (dni == null || isNaN(dni) || dni < 100000 || dni > 99999999 || await searchUser({ dni: dni, promotion })) {
            const e = new Error(ERRORS_STRINGS.DNI_ERROR_MESSAGE)
            e.type = ERRORS_STRINGS.DNI_ERROR_TYPE
            throw e
        } else if (email == null || (email.split('@')).length == 1 || await searchUser({ normalizedEmail: email.toUpperCase(), promotion })) {
            const e = new Error(ERRORS_STRINGS.EMAIL_ERROR_MESSAGE)
            e.type = ERRORS_STRINGS.EMAIL_ERROR_TYPE
            throw e
        } else if (phone == null || isNaN(phone) || await searchUser({ phone: phone, promotion })) {
            const e = new Error(ERRORS_STRINGS.PHONE_ERROR_MESSAGE)
            e.type = ERRORS_STRINGS.PHONE_ERROR_TYPE
            throw e
        } else if (token == null || (await searchUser({ token: token, promotion })) != null) {
            const e = new Error(ERRORS_STRINGS.TOKEN_ERROR_MESSAGE)
            e.type = ERRORS_STRINGS.TOKEN_ERROR_TYPE
            throw e
        } else if (referrals == null || isNaN(referrals)) {
            const e = new Error(ERRORS_STRINGS.REFERRALS_ERROR_MESSAGE)
            e.type = ERRORS_STRINGS.REFERRALS_ERROR_TYPE
            throw e
        }
        return {
            name,
            lastname,
            dni,
            email,
            phone,
            token,
            referrals,
            promotion: promotion
        }
    }
};
