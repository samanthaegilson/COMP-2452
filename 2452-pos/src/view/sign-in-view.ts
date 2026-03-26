import type AccountController from "../controller/account-controller";

/**
 * A view to sign in or create an {@link Account}.
 */
export default class SignInView {
    #controller: AccountController;

    /**
     * Constructor for SignInView. Displays the window
     * 
     * @param controller the controller of the view
     */
    constructor(controller: AccountController) {
        this.#controller = controller;

        document.querySelector("#app")!.innerHTML =
            `<div id='sign-in'>
                <button id="login">Login</button>
                <button id="create-account">Create Account</button>
                <span id="error"></span><br />
            </div>`


        // Open the view to login to an account
        document.querySelector("#login")!
            .addEventListener("click", () => this.#controller.showLoginView())

        // Open the view to create an account
        document.querySelector("#create-account")!
            .addEventListener("click", () => this.#controller.showCreateAccountView())
    }
}