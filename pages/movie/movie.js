
import { handleHttpErrors } from "../../utils.js";
import { API_URL,getHeaders } from "../../settings.js";

let headers = getHeaders()
let URL = API_URL+"/movies/"

let formAddMovie

//const SERVER_URL = URL



export async function initMovie(){
    try{
        formAddMovie = /** @type {HTMLFormElement} */  (document.getElementById('new-movie-form'));
        document.getElementById("add-new-btn").onclick = clearMovie
        document.getElementById("btn-submit-movie").onclick = submitMovie
        document.getElementById("delete-btn").onclick = deleteMovie
        document.getElementById("add-new-imdb").onclick = addImdbMovie
    
        const movies = await fetch(URL,{
        headers:headers
       }).then(handleHttpErrors)
       updateUI(movies);
    } catch(error){
    }
}

  function updateUI(movies){
    let tableRows = movies.map(m=>`

    <td>${m.name}</td>
    <td>${m.playTime}</td>
    <td>${m.description}</td>
    <td>${m.genre}</td>
    <td>${m.id}</td>

    </tr>`).join("")

    document.getElementById("tbody").innerHTML=tableRows

  }

    
    

function submitMovie (e) {
  e.preventDefault();
  const formData = new FormData(formAddMovie);
  const movieDataFromForm = Object.fromEntries(formData)
  console.log(movieDataFromForm)
  const options = {
    method: 'POST',
    body: JSON.stringify(movieDataFromForm),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  fetch(URL, options)
   .then(res=>res.json())
   .then(result =>  document.getElementById("new-movie-status").innerText =
    "New movie added with ID: " + result.id + `(${JSON.stringify(result)})`)
}

function clearMovie(evt ){
  evt.preventDefault()
  document.getElementById("name-id").value=""
  document.getElementById("playTime-id").value=""
  document.getElementById("description-id").value=""
  document.getElementById("genre-id").value=""
  document.getElementById("movie-id").value=""

}

async function deleteMovie() {
  let movieId= document.getElementById("deleteName").value;
   
  headers.append('Content-type','application/json')
  await fetch(`${URL}${movieId}`,{
    headers: headers,
    method:'delete'
  }).then(handleHttpErrors);
  initMovie();
  }


async function addImdbMovie(){
 let imdb = document.getElementById('imdb-id').value 
 const token = localStorage.token
 headers.append('Authentication''Bearer '+token )
 await fetch(`${URL}+imdb`),{
   headers: headers,
   method:'post'
 }).then(handleHttpErrors);
 initMovie();
 

}