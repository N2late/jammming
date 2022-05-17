import { clientID } from "./config";

const redirectURL = "http://jammming-music-react.netlify.app";

let userAccessToken;

const Spotify = {
    getAccessToken() {
        if(userAccessToken) {
            return userAccessToken;
        }

        //check for access token match -> point 79
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
        
        if(accessTokenMatch && expiresInMatch) {
            userAccessToken = accessTokenMatch[1];
            const expireIn = Number(expiresInMatch[1]);

            // this clears the parameters, allowing us to grab a new access token when it expire.
            window.setTimeout(() => userAccessToken = '', expireIn * 1000)
            window.history.pushState('Access Token', null, '/');
            return userAccessToken; 
        } 
        // access token variable is empty and is not in the URL -> Redirect users
        else {
            let accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`
            window.location = accessUrl;
        }
    },
    
    search(term) {
        const accessToken = Spotify.getAccessToken();
        const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        
        return fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
                return response.json(); 
        }).then(jsonResponse => {
                if(!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                })); 
            });
    },

    savePlaylist(playlistName, tracks){
        if(!playlistName || !tracks) {
            return;
        }

        let accessToken = Spotify.getAccessToken();
        let header = { Authorization: `Bearer ${accessToken}`};
        let userID;

        return fetch('https://api.spotify.com/v1/me', { headers: header})
                .then(response => response.json())
                .then(jsonResponse => {
                    userID = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                        method: 'POST',
                        body: JSON.stringify({ name: playlistName }),
                        headers: header
                    })
                        .then(response => response.json())
                        .then(jsonResponse => { 
                            let playlistID = jsonResponse.id;
                            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                                method: 'POST',
                                body: JSON.stringify({ uris: tracks}),
                                headers: header
                            })
                    })
                })
        }
};

export { Spotify };