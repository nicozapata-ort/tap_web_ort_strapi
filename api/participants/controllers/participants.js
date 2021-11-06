'use strict';
const { v4: uuidv4 } = require('uuid')
const { validateUser } = require('../models/participants.js')
const RANKING_LENGTH = 0

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async registrar(ctx) {
        try {
            const cupon = await strapi.services.cupones.findOne({ usado: false })
            if (!cupon) {
                throw new Error('No hay cupones disponibles')
            }
            ctx.request.body.Token = uuidv4();
            ctx.request.body.Referidos = 0;
            const user = await validateUser(ctx.request.body);
            user.normalizedEmail = user.Email.toUpperCase()
            user.UltimoReferido = new Date();
            const { referr } = ctx.query;
            await strapi.services.participants.create(user);
            if (referr) {
                const entity = await strapi.services.participants.findOne({ Token: referr })
                if (entity) {
                    entity.UltimoReferido = new Date();
                    entity.Referidos++;
                    await strapi.services.participants.update({ id: entity.id }, entity);
                }
            }
            cupon.usado = true;
            await strapi.services.cupones.update({ id: cupon.id }, cupon);
            ctx.send({
                status: 201,
                url_referidos: process.env.URL_LANDING + `?referr=${user.Token}`,
                cupon: cupon.cupon
            });
        } catch (error) {
            ctx.send({
                status: 401,
                type: error,
                message: error.message
            });
        }

    },

    async getRanking(ctx) {
        try {
            const { email } = ctx.request.query
            if (!email) {
                throw new Error()
            }
            let users = await strapi.services.participants.find();
            const sortUsers = (a, b) => {
                if (a.Referidos === b.Referidos) {
                    return a.UltimoReferido - b.UltimoReferido
                } else {
                    return b.Referidos - a.Referidos
                }
            }
            users = users.sort(sortUsers)
            const position = users.findIndex((u) => u.Email === email)
            const userInTop = position <= RANKING_LENGTH
            users = users.splice(RANKING_LENGTH)
            users = users.map((u, index) => {
                return {
                    Nombre: u.Nombre,
                    Apellido: u.Apellido[0] + '.',
                    position: index + 1,
                    Referidos: u.Referidos
                }
            })

            ctx.send({
                status: 200,
                data: users,
                positionUserEmail: position + 1
            })
        } catch (error) {
            ctx.send({
                status: 401,
                type: error,
                message: error.message
            });
        }
    },

    async obtenerParticipantes(ctx) {
        const participantes = await strapi.services.participants.find(ctx.query)
        return participantes[0]
    }
};
