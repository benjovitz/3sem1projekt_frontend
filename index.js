//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"  //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
} from "./utils.js"

import { initLogin,logout } from "./pages/login/login.js"
import { initSignup } from "./pages/signup/signup.js"

import { initAddReservation } from "./pages/addreservation/addreservation.js";
import { InitShowingReservations } from "./pages/showingeservations/showingreservations.js";
import { InitUserReservations } from "./pages/userreservations/userreservations.js";

import { initAddShowing } from "./pages/addshowing/addshowing.js";
import { initEditShowing } from "./pages/editshowing/editshowing.js";
import { initOwnerShowings } from "./pages/ownershowings/ownershowings.js";
import { initUserShowings } from "./pages/usershowings/usershowings.js";


import { initChatRobot } from "./pages/chatRobot/chatRobot.js";


window.addEventListener("load", async () => {


  const templateSignup = await loadTemplate("./pages/signup/signup.html")
  const templateLogin = await loadTemplate("./pages/login/login.html")
  const templateNotFound = await loadTemplate("./pages/notFound/notFound.html")

  const templateAddReservation = await loadTemplate("./pages/addreservation/addreservation.html")
  const templateShowingReservations = await loadTemplate("./pages/showingeservations/showingreservations.html")
  const templateUserReservations = await loadTemplate("./pages/userreservations/userreservations.html")

  const templateAddShowing = await loadTemplate("./pages/addshowing/addshowing.html")
  const templateEditShowing = await loadTemplate("./pages/editshowing/editshowing.html")
  const templateOwnerShowings= await loadTemplate("./pages/ownershowings/ownershowings.html")
  const templateUserShowings = await loadTemplate("./pages/usershowings/usershowings.html")

  document.getElementById("btn-send-chat").onclick = initChatRobot


  adjustForMissingHash()

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => document.getElementById("content").innerHTML = `
        <h2>Home</h2>
        <img style="width:50%;max-width:600px;margin-top:1em;" src="./images/cars.png">
        <p style='margin-top:1em;font-size: 1.5em;color:darkgray;'>
          Car's 'R' Us - Created, as a help to make GREAT fullstack developers <span style='font-size:2em;'>&#128516;</span>
        </p>
     `,
      "/signup": () => {
        renderTemplate(templateSignup, "content")
        initSignup()
      },
      "/login": () => {
        renderTemplate(templateLogin, "content")
        initLogin()
      },
      "/logout": () => {
        logout()
      },
      "/user/reservations": () => {
        renderTemplate(templateUserReservations, "content")
        InitUserReservations()
      },
      "/owner/reservations": (match) => {
        renderTemplate(templateShowingReservations,"content")
        InitShowingReservations(match)
      },
      "/create/reservation": (match) => {
        renderTemplate(templateAddReservation,"content")
        initAddReservation(match)
      },
      "/create/showing": (match) => {
        renderTemplate(templateAddShowing,"content")
        initAddShowing(match)
      },
      "/edit/showing": (match) => {
        renderTemplate(templateEditShowing,"content")
        initEditShowing(match)
      },
      "/user/showings": () => {
        renderTemplate(templateUserShowings,"content")
        initUserShowings()
      },
      "/owner/showings": () => {
        renderTemplate(templateOwnerShowings,"content")
        initOwnerShowings()
      }
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}