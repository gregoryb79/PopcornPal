import { doLogIn as defaultDoLogIn } from "./model.js";

export async function onLoginFormSubmit(
  formData: FormData,
  doLogIn: (email: string, password: string) => Promise<void> = defaultDoLogIn // Default to the real function for testing
): Promise<boolean> {

    const rawData = Object.fromEntries(formData);  
    console.log(`login form submitted, email: ${rawData.email}, password: ${rawData.password}`);

    if(!rawData.email){
        throw new Error("email can't be empty"); 
    }
    console.log(typeof rawData.email);
    if (typeof rawData.email !== "string"){
        throw new Error("email must be a string");
    }
    if(!rawData.password){
        throw new Error("Password can't be empty"); 
    }
    if (typeof rawData.password !== "string"){
        throw new Error("Password must be a string");
    }
     
    const email = rawData.email;
    const password = rawData.password; 
        
    try{
        await doLogIn(email,password); 
        return true;       
    } catch (error){
        console.error(`failed to log in with: ${email} - ${password}, error: ${error}`);
        throw error;
    }        
     
   
}