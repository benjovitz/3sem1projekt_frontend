import { API_URL} from "../../settings.js"
import {handleHttpErrors, sanitizeStringWithTableRows} from "../../utils.js";


const URL = API_URL + "/review/"

export function initCinemaReviews() {
    document.getElementById("btn-get-reviews").onclick = getReviews;
}

async function getReviews() {
    const cinemaID = document.getElementById("cinema-input").value
    await fetch(URL+"cinema/"+cinemaID, {
        method: "GET",
        headers: {'Content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            makeTable(data)
        })
}
function makeTable(reviews) {
    const tableRows = reviews.map(review =>
        `<tr>
        <td>${review.cinemaName}</td>
        <td>${review.comment}</td>
        <td>${review.score}</td>
        <td>${review.username}</td>
    </tr>`)
    const tableRowsAsString = tableRows.join('');
    document.getElementById("table-rows").innerHTML = sanitizeStringWithTableRows(tableRowsAsString)
}