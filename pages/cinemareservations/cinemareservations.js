import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";
import { addSeatToReservation, getOccupiedSeats, setupSVG } from "../addreservation/addreservation.js";

const URL = API_URL + "reservations/"

let showingId
const seats = []

function cinemaReservationsInnit(){
    window.addEventListener("load", async () => {
    getShowingReservations()
    document.getElementById("tbody").onclick = evt => makeModalBody(evt)
    document.getElementById("seat-svg").onclick = evt => addSeatToReservation(evt)
    })
}

async function getShowingReservations(){
    const token = localStorage.getItem("token")
    try{
    const showingReservations = await fetch(URL + 'cinema/'+showingId , {
        headers: { 'Authorization': 'Bearer ' + token}
    }).then(handleHttpErrors)
    const showingReservationsString = showingReservations.map(makeReservationTableRow)
    const reservationlistString = showingReservationsString.join("")

    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(reservationlistString)

    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

function makeReservationTableRow(showingReservation){
    const reservationRowString = 
    `<tr>
    <td>${showingReservation.movieName}</td>
    <td>${showingReservation.username}</td>
    <td>${showingReservation.seats}</td>
    <td>${showingReservation.dateTime}</td>
    <td>${showingReservation.priceSum +" kr"}</td>
    <td>
    <buttom id="btn-openmodal-${showingReservation.id}" type="button" class="btn btn-primary" data-toggle="modal" data-target="#reservation-modal">Edit</buttom>
    <buttom id="btn-cancel-reservation-${showingReservation.id}" type="button" class="btn btn-secondary">Cancel</buttom>
    </td>
    </tr>` 
    return reservationRowString
}

async function makeModalBody(evt){
    const target = evt.target
    const targetId = target.id
    
    const targetIdSplit = targetId.split("-")

    if(targetIdSplit[1]== 'openmodal'){
        const resId = targetIdSplit[2]

        const occupiedSeats = await getOccupiedSeats()
        const previousSeats = await getReservationById(resId)

        const updatedSeats = occupiedSeats.filter(n => !(previousSeats.includes(n)))

        await setupSVG(updatedSeats)

        addPreviousSeats(previousSeats)
    }

}

function addPreviousSeats(seatIds){
    for(const seatId of seatIds){
        if(seatId!="seat-svg"){
            if(seats.includes(seatId)){
                document.getElementById('seat-'+seatId).style.fill = "black"
                seats.splice(seats.indexOf(seatId),1)
            }
            else{
                document.getElementById('seat-'+seatId).style.fill = "green"
                seats.push(seatId)
            }
        }
    }
}


async function getReservationById(resId){
    const token = localStorage.getItem("token")
    try{
    const reservation = await fetch(URL + resId , {
        headers: { 'Authorization': 'Bearer ' + token}
    }).then(handleHttpErrors)
    return reservation.seats
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}