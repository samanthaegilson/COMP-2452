import type ReceiptController from "../controller/receipt-controller";

/**
 * A view for a {@link BOGO}.
 */
export default class BOGOView {
    #controller: ReceiptController;
    #dialog: HTMLDialogElement;

    /**
     * Constructs a BOGOView. Displays the window
     * 
     * @param controller the controller of the view
     */
    constructor(controller: ReceiptController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "coupon-dialog";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="type">Choose product</label>
            <button id="apple">Apple</button>
            <button id="banana">Banana</button>
            <button id="milk">Milk</button>
            <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#apple")!
            .addEventListener("click", () => this.#apple());

        this.#dialog.querySelector("#banana")!
            .addEventListener("click", () => this.#banana());

        this.#dialog.querySelector("#milk")!
            .addEventListener("click", () => this.#milk());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * Adds an apple as the BOGO product
     */
    #apple() {
        if (this.#controller.bogoApple()) {
            this.#controller.hideBOGOView();
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if there is not enough apples to add a BOGO to
            this.#dialog.querySelector("#error")!
                .textContent = "Not enough apples in cart for a BOGO. Please "
                + "apply BOGO to a product with a quantity of 2 or more, e.g. 3.";
        }
    }

    /**
     * Adds a banana as the BOGO product
     */
    #banana() {
        if (this.#controller.bogoBanana()) {
            this.#controller.hideBOGOView();
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if there is not enough bananas to add a BOGO to
            this.#dialog.querySelector("#error")!
                .textContent = "Not enough bananas in cart for a BOGO. Please "
                + "apply BOGO to a product with a quantity of 2 or more, e.g. 3.";
        }
    }

    /**
     * Adds a milk as the BOGO product
     */
    #milk() {
        if (this.#controller.bogoMilk()) {
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if there is not enough milk to add a BOGO to
            this.#dialog.querySelector("#error")!
                .textContent = "Not enough milk in cart for a BOGO. Please "
                + "apply BOGO to a product with a quantity of 2 or more, e.g. 3.";
        }
    }

    /**
     * Removes the view
     */
    #cancel() {
        this.#controller.hideBOGOView();
        document.body.removeChild(this.#dialog);
    }
}