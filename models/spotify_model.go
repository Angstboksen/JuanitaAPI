package models

type SpotifyCredentials struct {
	ClientId     string `json:"client_id" validate:"required"`
	ClientSecret string `json:"client_secret" validate:"required"`
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
}
