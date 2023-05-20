"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

class Story {
    constructor({storyId, title, author, url, username, createdAt}){
        this.storyId = storyId;
        this.title = title;
        this.author = author;
        this.url = url;
        this.username = username;
        this.createdAt = createdAt;
    }

    /* Parses hostname out of URL and returns it && changed*/
    getHostName(){
        return new URL(this.url).host;
    }
}

class StoryList{
    constructor(stories){
        this.stories = stories;
    }

    /* Generates new StoryList: calls API, builds array, creates an instance, returns instance && changed */
    static async getStories(){
        const response = await axios({
            url: `${BASE_URL}/stories`, method: "GET",
        });

        /* Takes API object, turns it into story instance & returns it && added */
        const stories = response.data.stories.map(story => new Story(story));
        return new StoryList(stories);
    }

    /* Adds story data to API, creates a story instance, adds it to the list, & returns new instance && added*/
    async addStory(user, {title, author, url}){
        const token = user.loginToken;
        const response = await axios({
            method: "POST", url:`${BASE_URL}/stories`, data:{token, story:{title, author, url}},
        });

        const story = new Story(response.data.story);
        this.stories.unshift(story);
        user.userStories.unshift(story);

        return story;
    }

    async removeStory(user, storyId){
        const token = user.loginToken;
        await axios ({
            url: `${BASE_URL}/stories/${storyId}`, method: "DELETE", data: {token: user.loginToken}
        });

        /*filter out stories to remove based on storyId && removeStory added*/
        this.stories = this.stories.filter(story => story.storyId !== storyId);
        user.userStories = user.userStories.filter(s => s.storyId !== storyId);
        user.favorites = user.favorites.filter(s => s.storyId !== storyId);
    }
}

class User{
    constructor({username, name, createdAt, favorites = [], userStories = [] }, token){
        this.username = username;
        this.name = name;
        this.createdAt = createdAt;
        /* creates new instances */
        this.favorites = favorites.map(s => new Story(s));
        this.userStories = userStories.map(s => new Story(s));
        this.loginToken = token;
    }

    /* Adds user to API, creates an instance & returns it */
    static async signup(username, password, name){
        const response = await axios({
            url: `${BASE_URL}/signup`, method: "POST", data: {user: {username, password, name}},
        });

        let {user} = response.data;

        return new User({
            username: user.username, name: user.name, createdAt: user.createdAt, favorites: user.favorites, userStories: user.stories
        }, response.data.token);
    }

    /*Logins in with user API, creates the instance & returns it */
    static async login(username, password){
        const response = await axios({
            url: `${BASE_URL}/login`, method: "POST", data:{user:{username, password}},
        });

        let {user} = response.data;

        return new User({
            username: user.username, name: user.name, createdAt: user.createdAt, favorites: user.favorites, userStories: user.stories
        }, response.data.token);
    }

    /* When user is already verifed, automatically log them in */
    static async loginViaStoredCredentials(token, username){
        try{
            const response = await axios({
                url:`${BASE_URL}/users/${username}`, method: "GET", params: {token},
            });

            let {user} = response.data;

            return new User({
                username: user.username, name: user.name, createdAt: user.createdAt, favorites: user.favorites, userStories: user.stories
            }, token);
        } catch (err){
            console.error("loginViaStoredCredentials failed", err);
            return null;
        }
    }

    /* Added */
    async addFavorite(story){
        this.favorites.push(story);
        await this._addOrRemoveFavorite("add", story)
    }

    async removeFavorite(story){
        this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
        await this._addOrRemoveFavorite("remove", story);
    }

    async _addOrRemoveFavorite(newState, story){
        const method = newState === "add" ? "POST" : "DELETE";
        const token = this.loginToken;
        await axios({
            url:`${BASE_URL}/users/${this.username}/favorites/${story.storyId}`, method: method, data: {token},
        });
    }

    isFavorite(story){
        return this.favorites.some(s => (s.storyId === story.storyId));
    }
}