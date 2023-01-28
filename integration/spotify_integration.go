package integration

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"juanitaapi/configs"
	"juanitaapi/models"
	"net/http"
	"net/url"

	"github.com/tsirysndr/go-spotify"
)

var spotifyClient = spotify.NewClient(FetchNewToken())

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
