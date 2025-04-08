import { Item, getItem, getRatingbyID, getReviewsbyID, returnedReview } from "../model.js";

export async function index(
    itemTitle: HTMLElement,itemSection: HTMLElement,reviewsSection: HTMLElement,
    reviewsList: HTMLElement, myRatingForm: HTMLFormElement, wlOptionsForm: HTMLFormElement) {
    
    const itemId = window.location.hash.substring(1); 
    const item = await getItem(itemId);  

    if(item){
        const usersRating = await getRatingbyID (itemId);
        const reviews = await getReviewsbyID (itemId); 
        const myRaiting = await getRatingbyUserID (itemId);
        const myWatchlistStatus = await getWatchlistStatus (itemId);
        renderPage(item,usersRating,reviews);
    }else{
        itemSection.innerHTML = "<h3>Oops, something went wrong, please retry...</h3>";
    }   

    
    const myRatingSelector = myRatingForm.querySelector<HTMLSelectElement>("#myRaiting");
    if (myRatingSelector) {
        myRatingSelector.addEventListener("change", (event) => {
            const selectedRating = (event.target as HTMLSelectElement).value;
            console.log("My Rating selected:", selectedRating);
        });
    }

    // Handle watchlist status selection
    const wlOptionsSelector = wlOptionsForm.querySelector<HTMLSelectElement>("#wlOptions");
    if (wlOptionsSelector) {
        wlOptionsSelector.addEventListener("change", (event) => {
            const selectedStatus = (event.target as HTMLSelectElement).value;
            console.log("Watchlist Status selected:", selectedStatus);
        });
    }

    // Display reviews
    const reviews = Array.from(reviewsList.querySelectorAll(".reviewCard"));
    reviews.forEach((review, index) => {
        console.log(`Review ${index + 1}:`, review.textContent);
    });

    // Example of adding a new review dynamically
    const addReview = (reviewText: string) => {
        const newReview = document.createElement("li");
        newReview.className = "reviewCard";
        newReview.textContent = reviewText;
        reviewsList.appendChild(newReview);
        console.log("New review added:", reviewText);
    };

    // Example usage of adding a review
    addReview("This is a dynamically added review.");

    function renderPage(item : Item, usersRating : number, reviews : returnedReview[]) {
        
        itemTitle.innerHTML=`
            <h2>
                ${item.title}
            </h2>            
            <p>
                ${item.releaseDate} - ${item.genres[0]} ${item.runtime ? ` - ${item.runtime} min.` : ""}
            </p>
        `;

        itemSection.innerHTML=`
            <div class="itemDetails">                                 
                <img src="${item.posterUrl ? item.posterUrl : "../placeholder_poster.jpg"}" alt="item poster image">         
                <section class="itemDescription">
                    <h4>Director: ${item.director ? item.director : "" }</h4>                    
                    <h4>Cast: ${item.cast[0] ? item.cast[0] : ""}, ${item.cast[1] ? item.cast[1] : ""}</h4> 
                    <h4>Description:</h4>
                    <p>${item.description ? item.description : ""}</p>                                   
                    <h4>Users rating: ${usersRating.toFixed(1)}</h4>                    
                </section>                
            </div>
            <section class="selectorsSection">
                <div>
                    <label for="myRaiting">My Rating:</label>
                     <select id="myRaiting" name="myRaiting" class="myRaitingSelector">
                    <option value="none">none</option>                        
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                </div>     
                <div>
                    <label for="wlOptions">Watchlist Status:</label>
                    <select id="wlOptions" name="wlOptions" class="wlOptionsSelector">
                        <option value="none">none</option>
                        <option value="Plan to Watch">Plan to Watch</option>
                        <option value="Watching">Watching</option>
                        <option value="Completed">Completed</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                </div>          
            </section>`;     

        reviewsSection.innerHTML=`                       
            <h2>Reviews</h2>
            <ul id="reviewsList" class="reviewsList"> 
                ${reviews.map((review) => `
                    <li class="reviewCard">${review.content}</li>
                    `).join("\n")}      
            </ul>`;


    }
}