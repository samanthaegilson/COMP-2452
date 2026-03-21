import type AccountController from "../controller/account-controller";

export default class CreateAccountView {
    #controller: AccountController;
    #dialog: HTMLDialogElement;

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
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    #createAccount() {
        // Catch exception if entered empty
        let username = this.#dialog.querySelector<HTMLInputElement>("#username")!.value;
        let password = this.#dialog.querySelector<HTMLInputElement>("#password")!.value;

        if (this.#controller.createAccount(username, password)) {
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if an account with that username already exists
            this.#dialog.querySelector("#error")!
                .textContent = "Username already exists. Please choose a "
                + " different one.";
        }
    }

    /**
     * Removes the view
     */
    #cancel() {
        this.#controller.hideCreateAccountView();
        document.body.removeChild(this.#dialog);
    }
}