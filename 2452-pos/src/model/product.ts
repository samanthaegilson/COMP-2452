export default interface Product {
    price: number;
    quantity: number;
    increaseQuantity(): void;
    decreaseQuantity(): boolean;
}