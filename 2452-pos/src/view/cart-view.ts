import type CartController from "../controller/cart-controller";
import type Cart from "../model/cart";
import { InvalidEmptyCartException } from "../model/receipt";

/**
 * A view for a {@link Cart}.
 */
export default class CartView {
    #cart: Cart;
    #productsEL: HTMLUListElement;
    #controller: CartController;

    /**
     * Constructs a CartView. Displays the page
     * 
     * @param cart the cart of the view
     * @param controller the controller of the view
     */
    constructor(cart: Cart, controller: CartController) {
        this.#cart = cart;
        this.#controller = controller;
        this.#cart.registerListener(this);

        document.querySelector("#app")!.innerHTML =
            `<div id='cart'>
                <button id="browse-products">Browse Products</button>
                <button id="check-out">Check Out</button>
                <span id="error"></span><br />
                <ul></ul>
            </div>`

        this.#productsEL = document.querySelector("#cart > ul")!;

        // Open the view to choose a product
        document.querySelector("#browse-products")!
            .addEventListener("click", () => this.#showChooseProduct())

        // Open the view of the receipt
        document.querySelector("#check-out")!
            .addEventListener("click", () => this.#showReceipt())
    }

    /**
     * Opens the choose product view
     */
    #showChooseProduct() {
        this.#controller.showChooseProductView();

        // Resetting the error message
        document.querySelector("#error")!.textContent = "";
    }

    /**
     * Opens the receipt view
     */
    #showReceipt() {
        try {
            this.#controller.showReceiptView();
        } catch (e: any) {
            if (e instanceof InvalidEmptyCartException) {
                document.querySelector("#error")!
                    .textContent = "Invalid cart size, cart must have at "
                    + "least one product (e.g., Apple).";
            } else {
                console.log("unexpected error " + e);
            }
        }
    }

    /**
     * Reacts to changes from the cart
     */
    notify() {
        // Empty the contents of the list
        this.#productsEL.replaceChildren();

        // Replaces the contents of the list
        this.#cart.products.forEach((p) => {
            let prodEl = document.createElement("li");
            prodEl.innerHTML = `<strong>${p.constructor.name + " x"
                + p.quantity}</strong>`;
            this.#productsEL.appendChild(prodEl);
        })
    }
}