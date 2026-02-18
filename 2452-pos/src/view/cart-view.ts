import type CartController from "../controller/cart-controller";
import type Cart from "../model/cart";

export default class CartView {
    #cart: Cart;
    #productsEL: HTMLUListElement;
    #controller: CartController;

    constructor(cart: Cart, controller: CartController) {
        this.#cart = cart;
        this.#controller = controller;
        this.#cart.registerListener(this);

        document.querySelector("#app")!.innerHTML =
            `<div id='cart'>
                <button id="browse-products">Browse Products</button>
                <button id="check-out">Check Out</button>
                <ul></ul>
            </div>`

        this.#productsEL = document.querySelector("#cart > ul")!;

        document.querySelector("#browse-products")!
            .addEventListener("click",
                () => this.#controller.showChooseProductView())

        document.querySelector("#check-out")!
            .addEventListener("click", () => this.#controller.showReceiptView())

    }

    notify() {
        // empty the contents of the list
        this.#productsEL.replaceChildren();

        this.#cart.products.forEach((p) => {
            let prodEl = document.createElement("li");
            prodEl.innerHTML = `<strong>${p.constructor.name + " x" + p.quantity}</strong>`;
            this.#productsEL.appendChild(prodEl);
        })
    }
}