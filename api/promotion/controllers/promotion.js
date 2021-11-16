'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const INVALID_PROMOTION_ID_MESSAGE = 'INVALID_PROMOTION_ID'
const SERVER_UNEXPECTED_ERROR_MESSAGE = 'UNEXPECTED_ERROR'

module.exports = {
    async findOnePromotion(ctx) {
        try {
            const { id } = ctx.params;
            if (!id) {
                throw new Error(INVALID_PROMOTION_ID_MESSAGE)
            }
            const promotion = await strapi.services.promotion.findOne({ id })
            const today = new Date()
            const dateMax = new Date(promotion.dateMax)
            promotion.expired = dateMax < today
            promotion.coupons = promotion.coupons.filter(coupon => coupon.used === false)
            promotion.couponsAvailabes = promotion.coupons.length > 0
            delete promotion.coupons

            return promotion
        } catch (error) {
            if (error.message === INVALID_PROMOTION_ID_MESSAGE) {
                ctx.body = error.message
                ctx.status = 404
            } else {
                ctx.body = SERVER_UNEXPECTED_ERROR_MESSAGE
                ctx.status = 500
            }
            ctx.send()
        }
    }
};
