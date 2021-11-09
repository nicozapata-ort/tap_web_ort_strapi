'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    validateUser: async ({ name, lastname, dni, email, phone, token, referrals, promotion }) => {
        const searchUser = strapi.services.participants.findOne
        if (name == null || name.length < 2) {
            const e = new Error('Nombre inválido')
            e.type = 'NOMBRE_INVALIDO'
            throw e
        } else if (lastname == null || lastname.length < 2) {
            const e = new Error('Apellido inválido')
            e.type = 'APELLIDO_INVALIDO'
            throw e
        } else if (dni == null || isNaN(dni) || dni < 100000 || dni > 99999999 || await searchUser({ dni: dni, promotion })) {
            const e = new Error('Dni inválido')
            e.type = 'DNI_INVALIDO'
            throw e
        } else if (email == null || (email.split('@')).length == 1 || await searchUser({ normalizedEmail: email.toUpperCase(), promotion })) {
            const e = new Error('Email inválido')
            e.type = 'EMAIL_INVALIDO'
            throw e
        } else if (phone == null || isNaN(phone) || await searchUser({ phone: phone, promotion })) {
            const e = new Error('Telefono inválido')
            e.type = 'TELEFONO_INVALIDO'
            throw e
        } else if (token == null || (await searchUser({ token: token, promotion })) != null) {
            const e = new Error('Token inválido')
            e.type = 'TOKEN_INVALIDO'
            throw e
        } else if (referrals == null || isNaN(referrals)) {
            const e = new Error('Referidos inválido')
            e.type = 'REFERIDOS_INVALIDO'
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
