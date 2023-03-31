import { API_URL } from "../../settings.js";
import { handleHttpErrors } from "../../utils.js";

const URL = API_URL + "/review/";
let rating = 0

export function initAddUserReview() {
    document.getElementById("addReview-btn").onclick = addUserReview;
    document.getElementById("stars-container").addEventListener("click", evt => {
        const star = evt.target.closest(".star")
        if (star) {
            rating = parseInt(star.dataset.rating);
            updateRating();
        }
    });
}

async function addUserReview(username) {
    document.getElementById("error").innerText = ""

    const rate = rating
    const comment = document.getElementById("comment").value

    const reviewDto = {rating:rate, comment:comment}


    const token = localStorage.token
    const options = {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`},
        body: JSON.stringify(reviewDto)
    }
    try {
        const response = await fetch(URL+"user/"+username, options).then(res => handleHttpErrors(res))
    } catch (err) {
        document.getElementById("error").innerText = err.message
    }
}

function updateRating() {
    document.getElementById("rating").innerText = rating;
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add("active");
        } else {
            star.classList.remove("active");
        }
    });
}