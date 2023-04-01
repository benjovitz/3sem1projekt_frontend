import { API_URL, setTokenHeader } from "../../settings.js"
import {handleHttpErrors} from "../../utils.js"

const URL = API_URL + "/auth/login"

export function initLogin() {
  document.getElementById("login-btn").onclick = login
}

export function logout(){
  document.getElementById("login-id").style.display="block"
  document.getElementById("logout-id").style.display="none"
  document.getElementById("nav-profile").style.display="none"
  document.getElementById("signup-id").style.display="block"
  localStorage.clear()
  window.router.navigate("/")
}


async function login(evt) {
  document.getElementById("error").innerText = ""

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value


  const userDto = { username, password }


  const options = {
    method: "POST",
    headers: { 'Content-type': 'application/json'},
    body: JSON.stringify(userDto)
  }
  try {
    const response = await fetch(URL, options).then(res=>handleHttpErrors(res))
    localStorage.setItem("user",response.username)
    localStorage.setItem("token",response.token)
    localStorage.setItem("roles",response.roles)

    document.getElementById("login-id").style.display="none"
    document.getElementById("logout-id").style.display="block"
    document.getElementById("nav-profile").style.display="block"
    document.getElementById("signup-id").style.display="none"

    setTokenHeader()

    window.router.navigate("")
  } catch (err) {
    document.getElementById("error").innerText = err.message
  }

}