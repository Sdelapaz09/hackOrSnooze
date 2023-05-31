"use strict";

let storyList;

async function getAndShowStoriesOnStart(){
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();
    putStoriesOnPage();
}

function generateStoryMarkup(story, showDeleteBtn = false){
    const hostName = story.getHostName();
    const showStar = Boolean(currUser);

    return $(`
        <li id="${story.storyId}">
            <div>
                ${showDeleteBtn ? getDeleteBtnHTML() : ""}
                ${showStar ? getStarHTML(story, currUser) : ""}
                <a href="${story.url}" target="a_blank" class="story-link">
                    ${story.title}
                </a>
                <small class="story-hostname"> (${hostName})</small>
                <div class="story-author">by ${story.author}</div>
                <div class="story-user"> Posted by ${story.username}</div>
            </div>
        </li>
    `);
}

function getDeleteBtnHTML(){
    return `
        <span class="trash-can">
            <i class="fas fa-trash-alt"></i>
        </span>`;
}

/* Added */
function getStarHTML(story, user){
    const isFavorite = user.isFavorite(story);
    const starType = isFavorite ? "fas" : "far";
    return `
        <span class="star">
            <i class=${starType} fa-star"></i>
        </span>`;
}

function putStoriesOnPage(){
    console.debug("putStoriesOnPage");
    $allStoriesList.empty();

    for(let story of storyList.stories){
        const $story = generateStoryMarkup(story);
        $allStoriesList.append($story);
    }

    $allStoriesList.show();
}

/* Added */
async function deleteStory(e){
    console.debug("deleteStory");
    const $closestLi = $(e.target).closest("li");
    const storyId = $closestLi.attr("id");

    await storyList.removeStory(currUser, storyId);

    await putUserStoriesOnpage();
}
$userStories.on("click", ".trash-can", deleteStory);

/* Added */
async function submitNewStory(e){
    console.debug("submitNewStory");
    e.preventDefault();

    const title = $("#create-title").val();
    const url = $("#create-url").val();
    const author = $("#create-author").val();
    const username = currUser.username;
    const storyData = {title, url, author, username};

    const story = await storyList.addStory(currUser, storyData);
    const $story = generateStoryMarkup(story);
    $allStoriesList.prepend($story);

    $submitForm.slideUp("slow");
    $submitForm.trigger("reset");
}
$submitForm.on("submit", submitNewStory);

function putUserStoriesOnPage(){
    console.debug("putUserStoriesOnPage");
    $userStories.empty();

    if(currUser.userStories.length === 0){
        $userStories.append(`<h5> No stories added by ${username} yet!</h5>`);
    } else{
        for(let story of currUser.userStories) {
            let $story = generateStoryMarkup(story, true);
            $userStories.append($story);
        }
    }
    $userStories.show();
}

    function putFavoritesListOnPage(){
        console.debug("putFavoritesListOnPage");
        $favoritedStories.empty();
      

        if(currUser.favorites.length === 0){
            $favoritedStories.append(`<h5> No favorites added!</h5>`);
        } else {
             for(let story of curruser.favorites){
            const $story = generateStoryMarkup(story);
            $favoritedStories.append($story);
            }
        }
    $favoritedStories.show();
    }


async function toggleStoryFavorites(e){
    console.debug("toggleStoryFavorite");

    const $tgt = $(e.target);
    const $closestLi = $tgt.closest("li");
    const storyId = $closestLi.attr("id");
    const story = storyList.stories.find(s => s.storyid === storyId);

    if($tgt.hasclass("fas")){
        await currUser.removeFavorite(story);
        $tgt.closest("i").toggleClass("fas far");
    } else {
        await currUser.addFavorite(story);
        $tgt.closest("i").toggleClass("fas far");
    }
}
$storiesLists.on("click", ".star", toggleStoryFavorites);