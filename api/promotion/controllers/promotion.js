'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async findOnePromotion(ctx) {
        try {
            const { id } = ctx.params;
            const promotion = await strapi.services.promotion.findOne({ id })
            const today = new Date()
            const dateMax = new Date(promotion.dateMax)
            promotion.expired = dateMax < today
            promotion.coupons = promotion.coupons.filter(coupon => coupon.used === false)
            promotion.couponsAvailabes = promotion.coupons.length > 0
            delete promotion.coupons

            return promotion
        } catch (error) {
            return { error }
        }
    }
};
