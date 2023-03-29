import { API_URL} from "../../settings.js"
import {handleHttpErrors} from "../../utils.js";


const URL = API_URL + "/users/"


export function initSignup() {
    document.getElementById("btn-signup").onclick = signup;
}

async function signup() {
    const username = document.getElementById("input-username").value
    const password = document.getElementById("input-password").value
    const email = document.getElementById("input-email").value
    const fullName = document.getElementById("input-fullname").value
    const phone = document.getElementById("input-phone").value
    const address = document.getElementById("input-address").value
    const city = document.getElementById("input-city").value
    const zip = document.getElementById("input-zip").value

    const userDto = {
        username: username,
        password: password,
        email: email,
        fullName: fullName,
        phone: phone,
        address: address,
        city: city,
        zip: zip
    }

    const options = {
        method: "POST",
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(userDto)
    }
    try {
        const response = await fetch(URL, options).then(res=>handleHttpErrors(res))
        window.router.navigate("")
    } catch (err) {
        document.getElementById("error").innerText = err.message
    }

}


