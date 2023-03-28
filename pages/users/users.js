import { API_URL } from "../../settings.js"
import {handleHttpErrors, sanitizeStringWithTableRows} from "../../utils.js";
const URL = API_URL + "/users/"

export async function initUsers() {
    await getAllUsers()
    document.getElementById("btn-fetch-user").onclick = getUser
    document.getElementById("btn-submit-edited-user").onclick = editUser
    document.getElementById("btn-delete-user").onclick = deleteUser
}

async function getUser() {
    const token = localStorage.token;
    const username = document.getElementById("username-input").value
    await fetch(URL+username, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
                document.getElementById("info-text").innerText = `Username: ${data.username} Name: ${data.fullName} E-mail: ${data.email} Address: ${data.address} Zip-code: ${data.zip} City: ${data.city} Phone: ${data.phone} Ranking: ${data.ranking} Roles: ${data.roles}`
                document.getElementById("username").value = `${data.username}`
        })
}

async function getAllUsers() {
    const token = localStorage.token;

    await fetch(URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => makeTable(data))
}

function makeTable(users) {
    const tableRows = users.map(user =>
        `<tr>
        <td>${user.username}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.address}</td>
        <td>${user.city}</td>
        <td>${user.zip}</td>
        <td>${user.phone}</td>
        <td>${user.ranking}</td>
    </tr>`).join('')
    document.getElementById("table-rows").innerHTML = sanitizeStringWithTableRows(tableRows)
}

async function editUser() {
    const username = document.getElementById("username").value
    const newPassword = document.getElementById("password").value
    const newName = document.getElementById("name").value
    const newEmail = document.getElementById("email").value
    const newAddress = document.getElementById("address").value
    const newZip = document.getElementById("zip").value
    const newCity = document.getElementById("city").value
    const newPhone = document.getElementById("phone").value
    const data = {"username":username, "fullName": newName, "password": newPassword,  "email": newEmail, "address": newAddress, "zip": newZip, "city": newCity, "phone": newPhone};

    const token = localStorage.token;
    const options ={method: 'PUT', headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}, body: JSON.stringify(data)}

    try{
        await fetch(URL+username, options).then(res=>handleHttpErrors)

        document.getElementById("succes").innerText = username + " is now updated"
    } catch(err) {
        document.getElementById("error").innerText = err.message
    }
}

async function deleteUser() {
    const username = document.getElementById("username").value
    const token = localStorage.token
    const options = {method: 'DELETE', headers: {'Authorization': `Bearer ${token}`}}

    try {
        await fetch(URL+username, options)
        document.getElementById("succes").innerText = username + " is now deleted"
        document.getElementById("error").innerText = ""
    } catch (err) {
        document.getElementById("error").innerText = err.message
        document.getElementById("succes").innerText = ""
    }
}
