'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    validateUser: async ({ Nombre, Apellido, Dni, Email, Telefono, Token, Referidos }) => {
        const buscarUsuario = strapi.services.usuarios.findOne
        if (Nombre == null || Nombre.length < 2) {
            const e = new Error('Nombre inválido')
            e.type = 'NOMBRE_INVALIDO'
            throw e
        } else if (Apellido == null || Apellido.length < 2) {
            const e = new Error('Apellido inválido')
            e.type = 'APELLIDO_INVALIDO'
            throw e
        } else if (Dni == null || isNaN(Dni) || Dni < 100000 || Dni > 99999999 || await buscarUsuario({ Dni: Dni })) {
            const e = new Error('Dni inválido')
            e.type = 'DNI_INVALIDO'
            throw e
        } else if (Email == null || (Email.split('@')).length == 1 || await buscarUsuario({ normalizedEmail: Email.toUpperCase() })) {
            const e = new Error('Email inválido')
            e.type = 'EMAIL_INVALIDO'
            throw e
        } else if (Telefono == null || isNaN(Telefono) || await buscarUsuario({ Telefono: Telefono })) {
            const e = new Error('Telefono inválido')
            e.type = 'TELEFONO_INVALIDO'
            throw e
        } else if (Token == null || (await strapi.services.usuarios.findOne({ Token: Token })) != null) {
            const e = new Error('Token inválido')
            e.type = 'TOKEN_INVALIDO'
            throw e
        } else if (Referidos == null || isNaN(Referidos)) {
            const e = new Error('Referidos inválido')
            e.type = 'REFERIDOS_INVALIDO'
            throw e
        }

        return {
            Nombre,
            Apellido,
            Dni,
            Email,
            Telefono,
            Token,
            Referidos
        }
    }
};
