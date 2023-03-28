import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"

const resURL = API_URL + "/reservations/"
const showURL = API_URL + "/showings/"
const cinURL = API_URL + "/cinema/"

//const seatsTest = ["a1","a2","a3","a4","b1","b2","b3","c1","c2"]
//const resSeatsTest = ["a1","a2","b2","c1","c2"]

const seats = []

let cinemaId
let showingId

window.addEventListener("load", async () => {
    await setupSVG(await getOccupiedSeats())
    //setupSVG(seatsTest,resSeatsTest)  
    document.getElementById("seat-svg").onclick = evt => addSeatToReservation(evt)
    document.getElementById("btn-create-reservation").onclick = evt => createReservation()
  })



async function initReservation(){
    window.addEventListener("load", async () => {
        await setupSVG()
        //setupSVG(seatsTest,resSeatsTest)  
        document.getElementById("seat-svg").onclick = evt => addSeatToReservation(evt)
        document.getElementById("btn-create-reservation").onclick = evt => createReservation()
      })

}

export async function setupSVG(givenOccupiedSeats){
    const cinemaSeatsUnsorted = await getCinemaSeats() 

    const occupiedSeatsUnsorted = givenOccupiedSeats

    const cinemaSeats = cinemaSeatsUnsorted.sort(function(a,b){return b - a})

    const occupiedSeats = occupiedSeatsUnsorted.sort(function(a,b){return b - a})

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


    const svgStringArray = rowList.map((n,rowNumber) => n.map((s,seatNumber) => makeSVGHTML(rowNumber,seatNumber,longestRow,s,n.length,occupiedSeats, distanceX, distanceY)))
    const arrayWithJoins = svgStringArray.map(n => n.join(" "))

    const svgValueLength = 60
    const svgValueHeight = 60
    const svgPadding = 80
    const svgLength = longestRow*svgValueLength + svgPadding
    const svgHeight = seatRows.size*svgValueHeight + svgPadding
    const rowIdentifiers = makeRowIdentifier(seatRows, longestRow, rowList, distanceX, distanceY)

    const svgSeats = `<svg width=${svgLength} height=${svgHeight} id="seat-svg">` + arrayWithJoins.join(" ") + rowIdentifiers +`</svg>`
    
    document.getElementById("svg-content").innerHTML = svgSeats

}


function makeSVGHTML(rowNumber, seatNumber, longestRow, id, rowSize, resSeats, distanceX, distanceY){
    

    const acnhorPointX = 40
    const acnhorPointY = 40

    const seatClickable = resSeats.includes(id) ? "none" : "auto"
    const seatColor = resSeats.includes(id) ? "red" : "black"

    const centering = (longestRow-rowSize)/2 * distanceX
    const startPosition = acnhorPointX + centering
    const positionX = startPosition + (seatNumber*distanceX)
    const positionY = acnhorPointY + (distanceY*rowNumber) 

    const stringRow = `<rect x=${positionX} y=${positionY} width="50" height="50" rx="7" ry="7" id="seat-${id}" fill="${seatColor}"pointer-events="${seatClickable}"/>
     <text x=${positionX+18} y=${positionY+35} font-size="30" fill="white" class="seat-text">${seatNumber+1}</text>`

    return stringRow
}

function makeRowIdentifier(seatRows, longestRow, rowList, distanceX, distanceY){
    const rowArray = Array.from(seatRows)
    const yPadding = 14
    const positionX = 5    
    
    const rowIdentifiers = rowArray.map((n,index) =>
        `<text x=${positionX + (longestRow-(rowList[index].length))/2 * distanceX} y=${distanceY*(index+1)+yPadding} font-size="25" fill="black" class="seat-text">${rowArray[index].toUpperCase()}</text>`)
    const rowIdentifiersString = rowIdentifiers.join(" ")

    return rowIdentifiersString
}

export function addSeatToReservation(evt){
const seatNode = evt.target
const seatId = seatNode.id
const seatSplit = seatId.split("-")
if(seatId!="seat-svg"){
    if(seats.includes(seatSplit[1])){
        seatNode.style.fill = "black"
        seats.splice(seats.indexOf(seatSplit[1]),1)
    }
    else{
        seatNode.style.fill = "green"
        seats.push(seatSplit[1])
    }
}
}

async function getCinemaSeats(){
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


export async function getOccupiedSeats(){
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


async function createReservation(){
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

    window.router.navigate("userreservations") 
    }catch(err){
        document.getElementById("error-text").innerText = err.message 
    }
}



