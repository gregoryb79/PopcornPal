import { doRegister as defaultDoRegister } from "./model.js";

export async function onRegisterFormSubmit(
  formData: FormData,
  doRegister: (user: { email: string; password: string; username: string }) => Promise<void> = defaultDoRegister // Default to the real function
): Promise<boolean> {

    const rawData = Object.fromEntries(formData);  
    console.log(`register form submitted, email: ${rawData.email},\n
                 password: ${rawData.password},\n
                 username: ${rawData.username}`);

    if(!rawData.email){
        throw new Error("email can't be empty"); 
    }
    if (typeof rawData.email !== "string"){
        throw new Error("email must be a string");
    }
    if(!rawData.password){
        throw new Error("Password can't be empty"); 
    }
    if (typeof rawData.password !== "string"){
        throw new Error("Password must be a string");
    }

    if(!rawData.username){
        throw new Error("username can't be empty"); 
    }
    if (typeof rawData.username !== "string"){
        throw new Error("username must be a string");
    }
     
    const user = {
        email: rawData.email,
        password: rawData.password,
        username: rawData.username
    };
        
    try{
        await doRegister(user);
        return true;         
    } catch (error){
        console.error(`failed to register with: ${user.email}, error: ${error}`);
        throw error;
    }        
     
   
}