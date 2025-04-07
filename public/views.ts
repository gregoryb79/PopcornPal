import {getItems, getRatings} from "./model.js"

export function index(itemsList : HTMLElement, searchForm : HTMLFormElement){

    console.log("hello PopcornPal");

    renderItemsCards("");


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
                                        <label class="myListcontainer">
                                            <input type="checkbox" class="checkbox">
                                            <span class="checkmark"></span>
                                        </label>
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