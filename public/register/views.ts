import {onRegisterFormSubmit} from "./controller.js";

export function register(registerForm : HTMLFormElement){

    registerForm.addEventListener("submit", async function(e){
        e.preventDefault();         

        const formElement = e.target as HTMLFormElement;
        const formData = new FormData(formElement , e.submitter);              

        formElement
            .querySelectorAll("input, button")
            .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = true);
        try{
            const result = await onRegisterFormSubmit(formData);
                        
            if (result){
                window.location.replace("/home");
                return;
            }                     
        }catch(error){
            console.error(error);
            alert(error);
        }     
        formElement
            .querySelectorAll("input, button")
            .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = false);

        registerForm.reset();  
    });
}