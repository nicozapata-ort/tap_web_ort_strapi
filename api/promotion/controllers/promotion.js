'use strict';
const { ERRORS_STRINGS } = require('../../../config/functions/errors/erros.js')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async findOnePromotion(ctx) {
        try {
            const { id } = ctx.params;
            const promotion = await strapi.services.promotion.findOne({ id })
            if (!promotion) {
                const e = new Error(ERRORS_STRINGS.INVALID_PROMOTION_ID_MESSAGE)
                e.type = ERRORS_STRINGS.INVALID_PROMOTION_ID_TYPE
                throw e
            }
            const today = new Date()
            const dateMax = new Date(promotion.dateMax)
            promotion.expired = dateMax < today
            promotion.coupons = promotion.coupons.filter(coupon => coupon.used === false)
            promotion.couponsAvailabes = promotion.coupons.length > 0
            delete promotion.coupons
            delete promotion.participants

            return promotion
        } catch (error) {
            if (error.type === ERRORS_STRINGS.INVALID_PROMOTION_ID_TYPE) {
                ctx.body = error.message
                ctx.status = 404
            } else {
                ctx.body = ERRORS_STRINGS.SERVER_UNEXPECTED_ERROR_MESSAGE
                ctx.status = 500
            }
            ctx.send()
        }
    }
};
