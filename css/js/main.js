"use strict";

/* Declarations */

const $body = $("body");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

/* Added */
const $favoritedStories = $("#favorited-stories");
const $userStories = $("#my-stories");
const $storiesContainer = $("#stories-container");
const $storiesLists = $(".stories-list");
const $submitForm = $("#submit-form");
const $navSubmitStory = $("#nav-submit-story");
const $userProfile = $("#user-profile");


const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogout = $("#nav-logout");

/* Hides everything on the page */
function hidePageComponents(){
    const components = [
        $loginForm, $signupForm, /* Added */ $storiesLists, $submitForm, $userProfile
    ];
    components.forEach(c => c.hide());
}

async function start(){
    console.debug("start");

    await checkForRememberedUser();
    await getAndShowStoriesOnStart();

    if(currUser) updateUIOnUserLogin();
}