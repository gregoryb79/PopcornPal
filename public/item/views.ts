import { Item, getItem, getRatingbyID, getReviewsbyID, returnedReview,
    getRatingbyUserID, getWatchlistStatus,
    setwlStatus, setRating, getReviewbyUserID, setReview,
    returnedRating,
    returnedWatchlist, 
    } from "../model.js";

export async function index(
    itemTitle: HTMLElement,itemDetails: HTMLElement,
    reviewsList: HTMLElement, myRatingSelector: HTMLSelectElement, wlOptionsSelector: HTMLSelectElement,
    reviewForm: HTMLFormElement, loadingSpinner: HTMLElement) {    
    
    let usersRating: number = 0;
    let reviews: returnedReview[] = [];
    let myWatchlistStatus : returnedWatchlist | null = null;
    let item : Item| null = null;
    let myReview : returnedReview | null = null;
    let myRaiting : returnedRating | null = null;

    const itemId = window.location.hash.substring(1); 

    try{
        if (loadingSpinner) {
            loadingSpinner.style.display = "block";
        }

        item = await getItem(itemId);  

        document.title = `PopcornPal | ${item?.title}`;

        usersRating = await getRatingbyID (itemId);
        console.log(`usersRating = ${usersRating}`);
    
        reviews = await getReviewsbyID (itemId); 
        console.log(`reviews = ${reviews}`);
    
        myReview = await getReviewbyUserID (itemId);
        console.log(`myReview = ${myReview?.content}`);   
    
        myRaiting = await getRatingbyUserID (itemId);
        console.log(`myRaiting = ${myRaiting?.score}`);    
    
        myWatchlistStatus = await getWatchlistStatus(itemId); 
        console.log(`myWatchlistStatus = ${myWatchlistStatus?.status}`); 

    } catch (error) {
        console.error("Error rendering items:", error);
    }finally {        
        if (loadingSpinner) {
            loadingSpinner.style.display = "none";
        }
    }
     

    if(item){
                
        renderItemOnPage(item,usersRating);
        console.log("done rendering item on page");       
        
        myRatingSelector.value = myRaiting ? myRaiting.score.toString() : "none";
        wlOptionsSelector.value = myWatchlistStatus ? myWatchlistStatus.status : "none";
        if (myReview){
            reviewForm["reviewText"].value = myReview.content;
            reviewForm.querySelector('button[type="submit"]')!.textContent = "Update";
            renderReviews(reviews.filter(review => review._id !== myReview._id));
            console.log("done rendering filtered reviews");
        }else{
            renderReviews(reviews);
            console.log("done rendering reviews");
        }

    }else{
        itemDetails.innerHTML = "<h3>Oops, something went wrong, please retry...</h3>";
    }     
    
    myRatingSelector.addEventListener("change", async (event) => {
        const rating = (event.target as HTMLSelectElement).value;        
        console.log(`rating = ${rating}`);

        if (!item) return;

        if (myRaiting){
            console.log(`rating already exists, updating it`);
            await setRating(item, rating, myRaiting._id);
        } else{
            console.log(`rating does not exist, creating it`);  
            await setRating(item, rating);
        }
    });

    wlOptionsSelector.addEventListener("change", async (event) => {
        const wlStatus = (event.target as HTMLSelectElement).value;        
        console.log(`rating = ${wlStatus}`);

        if (!item) return;

        if (myWatchlistStatus){
            console.log(`rating already exists, updating it`);
            await setwlStatus(item, wlStatus, myWatchlistStatus._id);
        } else{
            console.log(`rating does not exist, creating it`);  
            await setwlStatus(item, wlStatus);
        }
    });

    reviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const reviewText = reviewForm["reviewText"].value;
        console.log(`reviewText = ${reviewText}`);

        if (!item) return;
        
        if (myReview){
            console.log(`review already exists, updating it`);
            await setReview(item, reviewText, myReview._id);            
        } else{
            console.log(`review does not exist, creating it`);  
            await setReview(item, reviewText);
            reviewForm.querySelector('button[type="submit"]')!.textContent = "Update";
        }
    });

    function renderItemOnPage(item : Item, usersRating : number) {
        
        itemTitle.innerHTML=`
            <h2>
                ${item.title}
            </h2>            
            <p>
                ${(new Date(item.releaseDate)).getFullYear()} - ${item.genres[0]} ${item.runtime ? ` - ${item.runtime} min.` : ""} ${item.seasons ? ` - ${item.seasons} ${item.seasons > 1 ? ` seasons` : `season`}` : ""}
            </p>
        `;

        itemDetails.innerHTML=`                                             
                <img src="${item.posterUrl ? item.posterUrl : "../placeholder_poster.jpg"}" alt="item poster image">         
                <section class="itemDescription">
                    <h4>Director: ${item.director ? item.director : "" }</h4>                    
                    <h4>Cast: ${item.cast[0] ? item.cast[0] : ""}, ${item.cast[1] ? item.cast[1] : ""}</h4> 
                    <h4>Description:</h4>
                    <p>${item.description ? item.description : ""}</p>                                   
                    <h4>Users rating: ${usersRating.toFixed(1)}</h4>                    
                </section>`;             

        console.log("Page rendered successfully");
    }

    function renderReviews(reviews : returnedReview[]) {
        
        reviewsList.innerHTML=` 
                ${reviews.map((review) => `
                    <li class="reviewCard"> - ${review.content}</li>
                    `).join("\n")}`;
        console.log("Reviews rendered successfully");
    }
}