import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const URL = API_URL + '/showings/owner'

export function initOwnerShowings(){
    getAllShowings()
    document.getElementById("tbody").onclick = evt => goToEvent(evt)
    document.getElementById("btn-search-cinema").onclick = evt => getAllShowings()
}

async function getAllShowings(){
       const search = document.getElementById("input-search-cinema").value

    const token = localStorage.getItem("token")
    try{
    let showings = await fetch(URL, {
        headers: { 'Authorization': 'Bearer ' + token}
    }).then(handleHttpErrors)

    
    if(search.length != 0){
        showings = showings.filter(n => filterByCinema(search,n.cinemaName))
    }

    const showingsStringArray = showings.map(n => makeShowingTableRow(n))
    const showingsString = showingsStringArray.join("")

    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(showingsString)

    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

function filterByCinema(search,cinemaName){ 
    if(cinemaName.length < search.length){
        return false
    }

    const citySubString = cinemaName.substring(0,search.length)

    if(citySubString.toLowerCase() === search.toLowerCase()){
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
    <button id="btn-edit-showing-${showing.id}-${showing.cinemaId}" type="button" class="btn btn-primary">Edit</button>
    <button id="btn-get-reservations-${showing.id}-${showing.cinemaId}" type="button" class="btn btn-secondary">Reservations</button>
    </td>
    </tr>` 
    return showingRowString
}

function goToEvent(evt){
    const target = evt.target
    const targetId = target.id
    const targetIdSplit = targetId.split("-")
    const showingId = targetIdSplit[3]
    const cinemaId = targetIdSplit[4]
    if(targetIdSplit[1]=='edit'){
        window.router.navigate(`/edit/showing?cinemaid=${cinemaId}&showingid=${showingId}`)
    }
    if(targetIdSplit[1]=='get'){
        window.router.navigate(`/owner/reservations?cinemaid=${cinemaId}&showingid=${showingId}`)
    }
}