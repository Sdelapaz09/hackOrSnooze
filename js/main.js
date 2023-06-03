"use strict";

/* Declarations */

const $body = $("body");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $favoritedStories = $("#favorited-stories");
const $userStories = $("#my-stories");
const $storiesContainer = $("#stories-container");
const $storiesLists = $(".stories-list");
const $submitForm = $("#submit-form");
const $userProfile = $("#user-profile");


const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogout = $("#nav-logout");
const $navSubmitStory = $("#nav-submit-story");

/* Hides everything on the page */
function hidePageComponents(){
    const components = [
        $loginForm, 
        $signupForm, 
        $storiesLists, 
        $submitForm, 
        $userProfile
    ];
    components.forEach(c => c.hide());
}

async function start(){
    console.debug("start");

    await checkForRememberedUser();
    await getAndShowStoriesOnStart();

    if(currUser) updateUIOnUserLogin();
}
console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
  
$(start);