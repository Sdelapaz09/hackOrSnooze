"use strict";

let currUser;

async function login(e){
    console.debug("login", e);
    e.preventDefault();

    const username = $("#login-username").val();
    const password = $("#login-password").val();
    currUser = await User.login(username, password);

    $loginForm.trigger("reset");

    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
}
$loginForm.on("submit", login);

async function signup(e){
    console.debug("signup", e);
    e.preventDefault();

    const name = $("#signup-name").val();
    const username = $("#signup-username").val();
    const password = $("#signup-password").val();

    currUser = await User.signup(username, password, name);

    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
    $signupForm.trigger("reset");
}
$signupForm.on("submit", signup);

function logout(e){
    console.debug("logout", e);
    localStorage.clear();
    location.reload();
}
$navLogout.on("click", logout);

async function checkForRememberedUser(){
    console.debug("checkForRememberedUser");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if(!token || !username)
        return false;

    currUser = await User.loginViaStoredCredentials(token, username);
}

function saveUserCredentialsInLocalStorage(){
    console.debug("saveUserCredentialsInLocalStorage");
    if(currUser){
        localStorage.setItem("token", currentUser.loginToken);
        localStorage.setItem("username", currUser.username);
    }
}

async function updateUIOnUserLogin(){
    console.debug("updateUIOnUserLogin");

    hidePageComponents();
    putStoriesOnPage();
    $allStoriesList.show();
    updateNavOnLogin();
    generateUserProfile();
    $storiesContainer.show();
}

function generateUserProfile(){
    console.debug("generateUserProfile");

    $("#profile-name").text(currUser.name);
    $("#profile-username").text(currUser.username);
    $("#profile-account-date").text(currUser.createdAt.slice(0,10));
}