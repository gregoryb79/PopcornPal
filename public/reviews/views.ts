import {getReviewsbyUser, returnedReview, updateReview} from "../model.js";

export async function index(    
    reviewsList: HTMLElement, reviewForm: HTMLFormElement,sortingOptions: HTMLSelectElement,
    loadingSpinner: HTMLElement) {
        
    let sort = "Newest";
    let reviews: returnedReview[] = [];   
        
    try{
        if (loadingSpinner) {
            loadingSpinner.style.display = "block";
        }    
        reviews = await getReviewsbyUser ();           
        renderReviews(reviews);     
    } catch (error) {
        console.error("Error rendering items:", error);
    }finally {        
        if (loadingSpinner) {
            loadingSpinner.style.display = "none";
        }
    } 

    reviewsList.addEventListener("click", async (event) => {
        const target = event.target as HTMLElement;
        const listItem = target.closest("li.reviewCard");
        if (!listItem) return;  

        const reviewId = listItem.getAttribute("data-id");
        if (!reviewId) return;
        console.log(`Review clicked: ${reviewId}`); 
        const review = reviews.find((review) => review._id === reviewId);
        if (!review) return;
        reviewForm.classList.add("active");
        reviewForm["reviewText"].value = review.content;
        reviewForm["reviewId"].value = review._id;
        const label = reviewForm.querySelector('label[for="reviewText"]') as HTMLLabelElement;
        if (label) {
            label.textContent = review.itemTitle;
        }
    });

    sortingOptions.addEventListener("change", async (event) => {
        sort = (event.target as HTMLSelectElement).value;
        console.log(`Sorting by: ${sort}`);        
        renderReviews(reviews, sort);
    });

    reviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();  
        const reviewText = reviewForm["reviewText"].value;  
        const reviewId = reviewForm["reviewId"].value;
        const review = reviews.find((review) => review._id === reviewId);
        if (review) {
            console.log(`Updating review: ${reviewId}`);
            review.content = reviewText;             
            await updateReview(review);  
        }
        reviewForm.reset();
        reviewForm.classList.remove("active"); 
        try{
            if (loadingSpinner) {
                loadingSpinner.style.display = "block";
            }    
            reviews = await getReviewsbyUser ();
            renderReviews(reviews, sort);     
        } catch (error) {
            console.error("Error rendering items:", error);
        }finally {        
            if (loadingSpinner) {
                loadingSpinner.style.display = "none";
            }
        }        
    });


    function renderReviews(reviews : returnedReview[], sort: string = "Newest") {
        if (sort === "Oldest") {
            console.log("Oldest sort selected");
            reviews.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        } else {
            console.log("Newest sort selected");
            reviews.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
        reviewsList.innerHTML=` 
                ${reviews.map((review) => `
                    <li class="reviewCard u-clickable" data-id="${review._id}"> 
                        <h3>${review.itemTitle}</h3>
                        <p class="u-secondaryColor u-itemTextFont">${(new Date(review.updatedAt).toLocaleDateString("he"))}</p>
                        <p>${review.content}</p>
                    </li>
                    `).join("\n")}`;
        console.log("Reviews rendered successfully");

        if (reviews.length === 0) {
            reviewsList.innerHTML = `<h3>You submitted no reviews yet.</h3>`;
        }
    }
}