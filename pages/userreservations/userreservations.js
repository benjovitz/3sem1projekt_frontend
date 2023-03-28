import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const URL = API_URL+"reservations"

function userResInnit(){
    getUserReservations()
}

async function getUserReservations(){
    const token = localStorage.getItem("token")
    try{
    const userReservations = await fetch(URL, {
        headers: { 'Authorization': 'Bearer ' + token}
    }).then(handleHttpErrors)
    const userReservationsString = userReservations.map(makeReservationTableRow)
    const reservationlistString = userReservationsString.join("")

    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(reservationlistString)

    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

function makeReservationTableRow(userReservation){
    const reservationRowString = 
    `<tr>
    <td>${userReservation.movieName}</td>
    <td>${userReservation.cinemaName}</td>
    <td>${userReservation.username}</td>
    <td>${userReservation.seats}</td>
    <td>${userReservation.dateTime}</td>
    <td>${userReservation.priceSum +" kr"}</td>
    </tr>` 
    return reservationRowString
}

