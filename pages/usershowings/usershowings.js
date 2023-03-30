import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const URL = API_URL + '/showings/user'

export function initUserShowings(){
    getAllShowings()
    document.getElementById("tbody").onclick = evt => goToCreateReservation(evt)
    document.getElementById("btn-search-city").onclick = evt => getAllShowings()
}

async function getAllShowings(){
    const search = document.getElementById("input-search-city").value

    const token = localStorage.getItem("token")
    try{
    let showings = await fetch(URL, {
        headers: { 'Authorization': 'Bearer ' + token}
    }).then(handleHttpErrors)

    if(search.length != 0 ){
        showings = showings.filter(n => filterByCity(search,n.city))
    }

    const showingsStringArray = showings.map(n =>makeShowingTableRow(n))
    const showingsString = showingsStringArray.join("")

    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(showingsString)

    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

function filterByCity(search,city){ 
    if(city.length < search.length){
        return false
    }
    const citySubString = city.substring(0,search.length)
    if(citySubString.toLowerCase() == search.toLowerCase()){
        return true
    }
    return false
}

function makeShowingTableRow(showing){
    const showingRowString = 
    `<tr>
    <td>${showing.movieName}</td>
    <td>${showing.cinemaName}</td>
    <td>${showing.city}</td>
    <td>${showing.dateTime}</td>
    <td>${showing.price +" kr"}</td>
    <td>
    <button id="btn-create-reservation-${showing.cinemaId}-${showing.id}" type="button" class="btn btn-primary">Book</button>
    </td>
    </tr>` 
    return showingRowString
}

function goToCreateReservation(evt){
    const target = evt.target
    const targetId = target.id
    const targetIdSplit = targetId.split("-")
    const cinemaId = targetIdSplit[3]
    const showingId = targetIdSplit[4]
    if(targetIdSplit[1]=='create'){
        window.router.navigate(`/create/reservation?showingid=${showingId}&cinemaid=${cinemaId}`)
    }
}