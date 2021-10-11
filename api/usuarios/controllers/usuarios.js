'use strict';
const { v4: uuidv4 } = require('uuid')
const { validarUsuario } = require('../models/usuarios.js')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async registrar(ctx) {
        try {
            ctx.request.body.Token = uuidv4()
            ctx.request.body.Referidos = 0
            const user = await validarUsuario(ctx.request.body)
            const { referr } = ctx.query;
            console.log(referr)
            if (referr) {
                const entity = await strapi.services.usuarios.findOne({ Token: referr })
                if (entity) {
                    entity.UltimoReferido = new Date();
                    entity.Referidos++;
                    await strapi.services.usuarios.update({ id: entity.id }, entity);
                }
            }
            await strapi.services.usuarios.create(user);
            ctx.send({
                status: 201,
                url_referidos: 'http://localhost:3000?' + `referr=${user.Token}`,
                cupon: 'AYSA2021'
            });
        } catch (error) {
            ctx.send({
                status: 401,
                type: error.type
            });
        }

    }
};
