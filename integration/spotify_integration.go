package integration

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"juanitaapi/configs"
	"juanitaapi/models"
	"net/http"
	"net/url"
	"time"

	"github.com/tsirysndr/go-spotify"
)

var spotifyClient = spotify.NewClient("invalidtoken")

func FetchNewTokenEvery50Minutes() {
	for {
		time.Sleep(50 * time.Minute)
		spotifyClient = spotify.NewClient(FetchNewToken())
	}
}

func FetchNewToken() string {
	credentials := configs.SpotifyCredentialsEnv()
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	encoded := base64.StdEncoding.EncodeToString([]byte(credentials.ClientId + ":" + credentials.ClientSecret))

	client := &http.Client{}
	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", bytes.NewBufferString(data.Encode()))
	if err != nil {
		return ""
	}
	req.Header.Add("Authorization", "Basic "+encoded)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		var token models.TokenResponse
		if err := json.NewDecoder(resp.Body).Decode(&token); err != nil {
			return ""
		}
		return token.AccessToken
	}

	return ""
}

func GetPlaylist(playlistId string) (*spotify.Playlist, bool) {
	spotifyClient = spotify.NewClient(FetchNewToken())
	result, err := spotifyClient.Playlist.Get(playlistId)
	if err != nil || result.Name == "" {
		return nil, true
	}

	return result, false
}
