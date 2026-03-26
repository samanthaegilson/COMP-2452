/**
 * An interface for products that can be added to a {@link Cart}.
 */
export default interface Product {
    id?: number;
    price: number;
    quantity: number;
    volume: boolean;
    increaseQuantity(amount: number): void;
    decreaseQuantity(amount: number): boolean;
}