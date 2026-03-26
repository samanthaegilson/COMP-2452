import type AccountController from "../controller/account-controller";

/**
 * A view to create a new {@link Account}.
 */
export default class CreateAccountView {
    #controller: AccountController;
    #dialog: HTMLDialogElement;

    /**
     * Constructor for CreateAccountView. Displays the window
     * 
     * @param controller the controller of the view
     */
    constructor(controller: AccountController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "create-account-dialog";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="username">Enter username</label>
            <input type="text" id="username"/>
            <label for="password">Enter password</label>
            <input type="text" id="password"/>
            <button id="create-account">Create Account</button>
            <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#create-account")!
            .addEventListener("click", () => this.#createAccount());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * Creates an account from the inputted username and password
     */
    #createAccount() {
        let username = this.#dialog.querySelector<HTMLInputElement>("#username")!.value;
        let password = this.#dialog.querySelector<HTMLInputElement>("#password")!.value;

        if (username.length > 0) {
            if (password.length > 0) {
                this.#controller.createAccount(username, password);
            } else {
                this.#dialog.querySelector("#error")!
                    .textContent = "Password must be at least one character, e.g. pass";
            }
        } else {
            this.#dialog.querySelector("#error")!
                .textContent = "Username must be at least one character, e.g. sam";
        }
    }

    /**
     * Displays an error if an account with that username already exists
     */
    duplicateUsername() {
        this.#dialog.querySelector("#error")!
            .textContent = "Username already exists. Please choose a "
            + " different one.";
    }

    /**
     * Removes the view
     */
    cancel() {
        this.#controller.hideCreateAccountView();
        document.body.removeChild(this.#dialog);
    }
}