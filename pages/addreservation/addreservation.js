import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"

const resURL = API_URL + "/reservations/"
const showURL = API_URL + "/showings/"
const cinURL = API_URL + "/cinema/"

//const seatsTest = ["a1","a2","a3","a4","b1","b2","b3","c1","c2"]
//const resSeatsTest = ["a1","a2","b2","c1","c2"]
// For test - ?showingid=1&cinemaid=1

const seats = []


export async function initAddReservation(match){
    if (match?.params?.showingid && match?.params?.cinemaid) {
        const showingId = match.params.showingid
        const cinemaId = match.params.cinemaid
        try {
            await setupSVG(await getOccupiedSeats(showingId),cinemaId, 400)
            //setupSVG(seatsTest,resSeatsTest)  
            document.getElementById("seat-svg").onclick = evt => addSeatToReservation(evt, seats)
            document.getElementById("btn-create-reservation").onclick = evt => createReservation(showingId)
        }catch(err){
            document.getElementById("error-text").innerText = err.message
        }
    }
}

export async function setupSVG(givenOccupiedSeats,cinemaId,pagePositionX){

    if(pagePositionX == null){
        pagePositionX = 0
    }

    const cinemaSeats = await getCinemaSeats(cinemaId) 

    const occupiedSeats = givenOccupiedSeats

    cinemaSeats.sort()

    occupiedSeats.sort()

    const seatRows = new Set()
    for(const seat of cinemaSeats){
        seatRows.add(seat.charAt(0))
    }   
    
    const rowList = []
    seatRows.forEach( n => rowList.push(cinemaSeats.filter(s => s.substring(0,1)== n)))
    
    const seatList = cinemaSeats.map(s => s.substring(1))
    const longestRow = seatList.sort(function(a,b){return b - a})[0]

    const distanceX = 60
    const distanceY = 60


    const svgStringArray = rowList.map((n,rowNumber) => n.map((s,seatNumber) => makeSVGHTML(rowNumber,seatNumber,longestRow,s,n.length,occupiedSeats, distanceX, distanceY, pagePositionX)))
    const arrayWithJoins = svgStringArray.map(n => n.join(" "))

    const svgValueLength = 60
    const svgValueHeight = 60
    const svgPadding = 80
    const svgLength = longestRow*svgValueLength + svgPadding
    const svgHeight = seatRows.size*svgValueHeight + svgPadding
    const rowIdentifiers = makeRowIdentifier(seatRows, longestRow, rowList, distanceX, distanceY, pagePositionX)

    const svgSeats = `<svg width=${svgLength+pagePositionX} height=${svgHeight} id="seat-svg">` + arrayWithJoins.join(" ") + rowIdentifiers +`</svg>`
    
    document.getElementById("svg-content").innerHTML = svgSeats

}


function makeSVGHTML(rowNumber, seatNumber, longestRow, id, rowSize, resSeats, distanceX, distanceY, pagePositionX){

    const acnhorPointX = 40 + pagePositionX
    const acnhorPointY = 40

    const seatClickable = resSeats.includes(id) ? "none" : "auto"
    const seatColor = resSeats.includes(id) ? "red" : "black"

    const centering = (longestRow-rowSize)/2 * distanceX
    const startPosition = acnhorPointX + centering
    const positionX = startPosition + (seatNumber*distanceX)
    const positionY = acnhorPointY + (distanceY*rowNumber) 

    const stringRow = `<rect x=${positionX} y=${positionY} width="50" height="50" rx="7" ry="7" id="seat-${id}" fill="${seatColor}"pointer-events="${seatClickable}"/>
     <text x=${positionX+16} y=${positionY+35} font-size="30" fill="white" class="seat-text">${seatNumber+1}</text>`

    return stringRow
}

function makeRowIdentifier(seatRows, longestRow, rowList, distanceX, distanceY, pagePositionX){
    const rowArray = Array.from(seatRows)
    const yPadding = 14
    const positionX = 5 + pagePositionX
    
    const rowIdentifiers = rowArray.map((n,index) =>
        `<text x=${positionX + (longestRow-(rowList[index].length))/2 * distanceX} y=${distanceY*(index+1)+yPadding} font-size="25" fill="black" class="seat-text">${rowArray[index].toUpperCase()}</text>`)
    const rowIdentifiersString = rowIdentifiers.join(" ")

    return rowIdentifiersString
}

export function addSeatToReservation(evt, seatArray){
const seatNode = evt.target
const seatId = seatNode.id
const seatSplit = seatId.split("-")
if(seatId!="seat-svg"){
    if(seatArray.includes(seatSplit[1])){
        seatNode.style.fill = "black"
        seatArray.splice(seatArray.indexOf(seatSplit[1]),1)
    }
    else{
        seatNode.style.fill = "green"
        seatArray.push(seatSplit[1])
    }
}
}

async function getCinemaSeats(cinemaId){
    const token = localStorage.getItem("token")
    try{
        const cinema = await fetch(cinURL+cinemaId,{
            headers:{ "Authorization":"Bearer "+ token}
        }).then(handleHttpErrors)
        const cinemaSeats = cinema.seats
        //console.log(cinemaSeats)
        return cinemaSeats
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}


export async function getOccupiedSeats(showingId){
    const token = localStorage.getItem("token")
    try{
    const showReservations = await fetch(showURL+showingId,{
        headers:{ "Authorization":"Bearer "+ token}
    } ).then(handleHttpErrors)

    const occupiedSeats = showReservations.resSeats

    //console.log(occupiedSeats)

    return occupiedSeats
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}


async function createReservation(showingId){
    const token = localStorage.getItem("token")
    try{
    await fetch(resURL, {
        method:'POST',
        headers:{ 
            'Content-Type': 'application/json',
            "Authorization":"Bearer "+ token
        },
        body: JSON.stringify({showingId,seats})
    }).then(handleHttpErrors)

    window.router.navigate("/user-reservations")
    }catch(err){
        document.getElementById("error-text").innerText = err.message 
    }
}



