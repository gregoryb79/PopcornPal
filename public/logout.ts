import {doLogout} from "./model.js"

export async function logOut(logoutIcon : HTMLElement) {

     logoutIcon.addEventListener("click", async () => {
            console.log("Logout clicked");
            try {
                await doLogout();
                window.location.replace("/login");
            }catch (error) {
                console.error("Logout failed", error);
            }
                   
        });
};