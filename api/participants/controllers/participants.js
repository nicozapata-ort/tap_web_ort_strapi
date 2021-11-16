'use strict';
const { v4: uuidv4 } = require('uuid')
const { validateUser } = require('../models/participants.js')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const customizeUser = async ({ user, promotionId }) => {
    let validUser = user
    validUser.token = uuidv4();
    validUser.referrals = 0;
    validUser.promotion = promotionId
    validUser = await validateUser(validUser);
    validUser.normalizedEmail = validUser.email.toUpperCase()
    validUser.lastReferral = new Date();
    return validUser

}

const searchCouponByPromotionId = async (promotionId) => {
    const coupon = await strapi.services.coupons.findOne({ used: false, promotion: promotionId })
    if (!coupon) {
        throw new Error('No hay  cupones disponibles')
    }
    return coupon
}

const updateReferral = async ({ referr, promotionId }) => {
    const entity = await strapi.services.participants.findOne({ token: referr, promotion: promotionId })
    if (entity) {
        entity.lastReferral = new Date();
        entity.referrals++;
        await strapi.services.participants.update({ id: entity.id }, entity);
    }
}
const finishRegister = async ({ validUser, coupon }) => {
    await strapi.services.participants.create(validUser);
    coupon.used = true;
    await strapi.services.coupons.update({ id: coupon.id }, coupon);
}

const sortUsers = (a, b) => {
    if (a.referrals === b.referrals) {
        return a.lastReferral - b.lastReferral
    } else {
        return b.referrals - a.referrals
    }
}

const validRanking = ({ users, promotion }) => {
    if (users.length > promotion.maxParticipants) {
        users = users.splice(promotion.maxParticipants)
    }
    users = users.map((u, index) => {
        return {
            name: u.name,
            lastname: u.lastname[0] + '.',
            position: index + 1,
            referrals: u.referrals
        }
    })
    return users
}

module.exports = {
    async register(ctx) {
        try {
            const { user, promotionId } = await ctx.request.body;
            const coupon = await searchCouponByPromotionId(promotionId)
            const validUser = await customizeUser({ user, promotionId })
            const { referr } = ctx.query;

            if (referr) {
                updateReferral({ referr, promotionId })
            }
            await finishRegister({ validUser, coupon })
            ctx.send({
                status: 201,
                url_referrals: process.env.URL_LANDING + `?referr=${validUser.token}`,
                coupon: coupon.coupon
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
            const { email, promotionId } = ctx.request.query

            if (!promotionId) {
                throw new Error()
            }
            const promotion = await strapi.services.promotion.findOne({ id: promotionId });
            let users = promotion.participants

            users = users.sort(sortUsers)

            let position = 0
            if (email) {
                position = (users.findIndex((u) => u.email === email)) + 1
            }

            users = await validRanking({ users, promotion })

            ctx.send({
                status: 200,
                data: users,
                positionUserEmail: position
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
