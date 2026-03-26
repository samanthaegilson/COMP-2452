import type Receipt from "./receipt";

/**
 * An interface for coupons that can be added to a {@link Receipt}.
 */
export default interface Coupon {
    id?: number;
    receipt: Receipt;
}