import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";
import { addSeatToReservation, getOccupiedSeats, setupSVG } from "../addreservation/addreservation.js";

const URL = API_URL + "/reservations/"

const seats = []

export async function InitShowingReservations(match){
    if (match?.params?.showingid && match?.params?.cinemaid) {
        const showingId = match.params.showingid
        const cinemaId = match.params.cinemaid
        try {
            await getShowingReservations(showingId)
            document.getElementById("tbody").onclick = evt => makeModalBody(evt, showingId, cinemaId)
            document.getElementById("svg-content").onclick = evt => addSeatToReservation(evt,seats)
            document.getElementById("modal-btns").onclick = evt => editReservation(evt, showingId)
        }catch(err){
            document.getElementById("error-text").innerText = err.message
        }
    }
    else{
        document.getElementById("error-text").innerText = 'Missing match parameters cinemaid and/or showingid'
    }
    
}

async function getShowingReservations(showingId){
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
    <button id="btn-openmodal-${showingReservation.id}" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#reservation-modal">Edit</button>
    <button id="btn-remove-reservation-${showingReservation.id}" type="button" class="btn btn-warning">Remove</button>
    </td>
    </tr>` 
    return reservationRowString
}

async function makeModalBody(evt, showingId, cinemaId){
    seats.length = 0
    const target = evt.target
    const targetId = target.id
    
    const targetIdSplit = targetId.split("-")

    if(targetIdSplit[1]== 'openmodal'){
        const resId = targetIdSplit[2]

        const occupiedSeats = await getOccupiedSeats(showingId)
        const previousSeats = await getReservationById(resId)



        const updatedSeats = occupiedSeats.filter(n => !(previousSeats.includes(n)))

        await setupSVG(updatedSeats, cinemaId)

        addPreviousSeats(previousSeats)

        const modalButtomsString = `
        <button id="btn-close-modal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button id="btn-edit-${resId}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
        `
        document.getElementById("modal-btns").innerHTML = sanitizeStringWithTableRows(modalButtomsString)
    } else if(targetIdSplit[1]== 'remove'){
        const resId = targetIdSplit[3]
        removeReservation(resId,showingId)
    }

}

async function removeReservation(resId,showingId){
    const token = localStorage.getItem("token")
    try{ 
        await fetch(URL+resId,{
            method: "DELETE",
            headers: { 'Authorization': 'Bearer ' + token}
        })//No handleHTTPerror due to void response
    }catch(err){
        console.log('hej')
        document.getElementById("error-text").innerText = err.message
    }

    await getShowingReservations(showingId)
}

function addPreviousSeats(seatIds){
    console.log(seatIds)
    for(const seatId of seatIds){
        document.getElementById('seat-'+seatId).style.fill = "green"
        seats.push(seatId)
    }
    console.log(seats)
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

async function editReservation(evt, showingId){

    const target = evt.target
    const targetId = target.id
    const targetIdSplit = targetId.split("-")
    const resId = targetIdSplit[2]

    if(targetIdSplit[1] == 'edit'){
        const token = localStorage.getItem("token")
        try{
        await fetch(URL + resId, {
            method:'PUT',
            headers:{ 
                'Content-Type': 'application/json',
                "Authorization":"Bearer "+ token
            },
            body: JSON.stringify({seats})
        }).then(handleHttpErrors)
            document.getElementById("error-text").innerText = ""
        }catch(err){
            document.getElementById("error-text").innerText = err.message 
        }
    }
    await getShowingReservations(showingId)
}