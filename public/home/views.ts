import {getItems, getRatings} from "../model.js"

export function index(itemsList : HTMLElement, searchForm : HTMLFormElement){

    console.log("hello PopcornPal");

    renderItemsCards("");

    itemsList.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;

        const listItem = target.closest("li.itemCard");
        if (!listItem) return; 
    
        const itemId = listItem.getAttribute("data-id");
    
        if (target.matches('input[type="checkbox"]')) {
            const checkbox = target as HTMLInputElement;
            console.log(`Checkbox clicked in item ${itemId}, checked: ${checkbox.checked}`);            
        }
        
        else if (target.tagName === "IMG") {
            console.log(`Image clicked in item ${itemId}`); 
            window.location.replace(`/item#${itemId}`);

        }
        
    });


   async function renderItemsCards(query : string) {
    try{
        const items = await getItems(query);
        console.log(items);

        if(items.length > 0) {
            const ratings = await getRatings(items);
            itemsList.innerHTML = items
                .map((item) => `                                
                                <li class="itemCard" data-id="${item._id}">
                                    <img src=${item.posterUrl} alt="poster image"></img>
                                    <h4>${item.title}</h4>
                                    <p class="releaseYear">${item.releaseDate}</p>
                                    <section class="raitingANDlist">
                                        <p class="raiting">${ratings.get(item._id)?.toFixed(1) ?? "0.0"}</p>
                                        <input type="checkbox" class="checkbox">                                                           
                                    </section>               
                                </li>
                                `)
                .join("\n");
        }else if (query != ""){
            itemsList.innerHTML = "<h3>No results for your search...</h3>"
        }else{
            itemsList.innerHTML = "<h3>Oops, something went wrong, please retry...</h3>"
        }        
        
    }catch(error){
        console.error(error);
    }     
   }
}