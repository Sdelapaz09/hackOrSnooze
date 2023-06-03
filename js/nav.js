"use strict";

/* Show list of all stories when site name is clicked */
function navAllStories(e){
    console.debug("navAllStories", e);
    hidePageComponents();
    putStoriesOnPage();
}
$body.on("click", "#nav-all", navAllStories);


function navSubmitStoryClick(e){
    console.debug("navSubmitStoryClick", e);
    hidePageComponents();
    $allStoriesList.show();
    $submitForm.show();
}
$navSubmitStory.on("click", navSubmitStoryClick);

function navFavoritesClick(e){
    console.debug("navFavoritesClick", e);
    hidePageComponents();
    putFavoritesListOnPage();
}
$body.on("click", "#nav-favorites", navFavoritesClick);

function navMyStories(e){
    console.debug("navMyStories", e);
    hidePageComponents();
    putUserStoriesOnPage();
    $userStories.show();
}
$body.on("click", "#nav-my-stories", navMyStories);

function navLoginClick(e){
    console.debug("navLoginClick", e);
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
    $storiesContainer.hide();
}
$navLogin.on("click", navLoginClick);

function navProfileClick(e){
    console.debug("navProfiledClick", e);
    hidePageComponents();
    $userProfile.show();
}

function updateNavOnLogin(){
    console.debug("updateNavOnLogin");
    $allStoriesList(".main-nav-links").css('display', 'flex');
    $navLogin.hide();
    $navLogout.show();
    $navUserProfile.text(`${currUser.username}`).show();
}