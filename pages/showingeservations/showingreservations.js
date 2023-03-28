import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";
import { addSeatToReservation, getOccupiedSeats, setupSVG } from "../addreservation/addreservation.js";

const URL = API_URL + "reservations/"

const seats = []

export async function InitShowingReservations(match){
    if (match?.params?.showingid) {
        const showingId = match.params.showingid
        try {
            await getShowingReservations(showingId)
            document.getElementById("tbody").onclick = evt => makeModalBody(evt)
            document.getElementById("seat-svg").onclick = evt => addSeatToReservation(evt,seats)
            document.getElementById("modal-btns").onclick = evt => editReservation(evt)
        }catch(err){
            document.getElementById("error-text").innerText = err.message
        }
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

        const modalButtomsString = `
        <button id="btn-edit-${resId}" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button id="btn-close-modal" type="button" class="btn btn-primary">Save changes</button>
        `
        document.getElementById("modal-btns").innerHTML = sanitizeStringWithTableRows(modalButtomsString)
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

async function editReservation(evt){

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

        document.getElementById("modal-result").style.color = "green"
        document.getElementById("modal-result").innerText = 'Success'
        }catch(err){
            document.getElementById("modal-result").style.color = "red"
            document.getElementById("modal-result").innerText = err.message 
        }
    }
}