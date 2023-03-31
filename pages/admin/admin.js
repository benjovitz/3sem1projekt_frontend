import { API_URL } from "../../settings.js"
import {handleHttpErrors} from "../../utils.js"

const URL = API_URL + "/users/admin"

export function initAdmin() {
    document.getElementById("addRole-btn").onclick = addRole
}

async function addRole() {
    document.getElementById("error").innerText = ""

    const username = document.getElementById("username").value
    const role = document.getElementById("role").value


    const roleDto = {username:username, role:role}


    const token = localStorage.token
    const options = {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`},
        body: JSON.stringify(roleDto)
    }
    try {
        const response = await fetch(URL+"/"+username+"/"+role, options).then(res => handleHttpErrors(res))

        document.getElementById("succes").innerText = username + " now has the authority " + role
    } catch (err) {
        document.getElementById("succes").innerText = ""
        document.getElementById("error").innerText = err.message
    }
}