type User = {
    _id: string,
    email: string,
    password: string,
    username: string,
    createdAt: string
}

type submittedUser = Omit<User,"createdAt"|"_id">;
export async function doRegister(user: submittedUser): Promise<void> {   
      
    const body = JSON.stringify(user);

    try{
        const res = await fetch(`/register`, {
            method: "post",
            body,
            headers: {
                "content-type": "application/json"
            }
        });
        if (!res.ok) {
            const message = await res.text(); 
            console.log(`Failed to register. Status: ${res.status}. Message: ${message}`);
            throw new Error(message);
        }
        console.log(`Registered with: ${user.email} - ${user.password}`);        
    }catch(error){
        console.error(`Error registering, throwing error: ${error}`);  
        throw error;      
    }    
}