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
            <select name="product" id="product">
                <option value="Apple">Apple</option>
                <option value="Banana">Banana</option>
                <option value="Milk">Milk</option>
            </select>
            <select name="type" id="type">
                <option value="Granny Smith">Granny Smith</option>
                <option value="Gala">Gala</option>
                <option value="Honeycrisp">Honeycrisp</option>
                <option value="Ambrosia">Ambrosia</option>
                <option value="McIntosh">McIntosh</option>
                <option value="Cavendish">Cavendish</option>
                <option value="Plantain">Plantain</option>
                <option value="Almond">Almond</option>
                <option value="Whole">Whole</option>
                <option value="Skim">Skim</option>
            </select>
            <button id="apply">Apply</button>
            <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#apply")!
            .addEventListener("click", () => this.#apply());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * Applies the BOGO to the cart
     */
    #apply() {
        const APPLE = "Apple";
        const BANANA = "Banana";
        let productClass = this.#dialog.querySelector<HTMLSelectElement>("#product")!.value;
        if (productClass == APPLE) {
            this.#apple();
        } else if (productClass == BANANA) {
            this.#banana();
        } else {
            this.#milk();
        }
    }

    /**
     * Adds an apple as the BOGO product
     */
    #apple() {
        let type = this.#dialog.querySelector<HTMLSelectElement>("#type")!.value;
        if (this.#controller.bogoApple(type)) {
            this.#controller.hideBOGOView();
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if there is not enough apples to add a BOGO to
            this.#dialog.querySelector("#error")!
                .textContent = "Not enough of these apples in cart for a BOGO. "
                + "Please apply BOGO to a product with a quantity of 2 or more,"
                + " e.g. 3.";
        }
    }

    /**
     * Adds a banana as the BOGO product
     */
    #banana() {
        let type = this.#dialog.querySelector<HTMLSelectElement>("#type")!.value;
        if (this.#controller.bogoBanana(type)) {
            this.#controller.hideBOGOView();
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if there is not enough bananas to add a BOGO to
            this.#dialog.querySelector("#error")!
                .textContent = "Not enough of these bananas in cart for a BOGO. "
                + "Please apply BOGO to a product with a quantity of 2 or more, "
                + "e.g. 3.";
        }
    }

    /**
     * Adds a milk as the BOGO product
     */
    #milk() {
        let type = this.#dialog.querySelector<HTMLSelectElement>("#type")!.value;
        if (this.#controller.bogoMilk(type)) {
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if there is not enough milk to add a BOGO to
            this.#dialog.querySelector("#error")!
                .textContent = "Not enough of this milk in cart for a BOGO. Please "
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