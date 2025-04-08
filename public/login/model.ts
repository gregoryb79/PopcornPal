export async function doLogIn(email : string, password: string): Promise<void> {
    
  const credentials = {
      email: email,
      password: password,
  };    

  const body = JSON.stringify(credentials);
  console.log(`body: ${body}`);

  try{
      const res = await fetch(`/login`, {
          method: "post",
          body,
          headers: {
              "content-type": "application/json"
          }
      });
      if (!res.ok) {
          const message = await res.text();             
          throw new Error(`Failed to log in. Status: ${res.status}. Message: ${message}`);
      }
      console.log(`loged in with: ${email} - ${password}`);
      
  }catch(error){
      console.error(`Error logging in`, error);  
      throw error;      
  }    
}