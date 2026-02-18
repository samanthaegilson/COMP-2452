import type CartController from "../controller/cart-controller.ts";
import Apple from "../model/apple.ts";

export default class AppleView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    constructor(controller: CartController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "apple-info";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="appleView">Apple</label>
            <button id="addApple">Add Apple</button>
            <button id="removeApple">Remove Apple</button>
            <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#addApple")!
            .addEventListener("click", () => this.#addApple());

        this.#dialog.querySelector("#removeApple")!
            .addEventListener("click", () => this.#removeApple());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    #addApple() {
        this.#controller.addProduct(new Apple());
        document.body.removeChild(this.#dialog);
    }

    #removeApple() {
        this.#controller.removeProduct(new Apple());
        // should return a boolean and output error message if false
        document.body.removeChild(this.#dialog);
    }

    #cancel() {
        this.#controller.hideProductViews();
        document.body.removeChild(this.#dialog);
    }
}