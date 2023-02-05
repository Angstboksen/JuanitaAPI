package configs

import (
	"juanitaapi/models"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func MongoUriEnv() string {
	err := godotenv.Load()
	if err != nil {
		log.Default().Println("Error loading .env file, using default MONGOURI")
	}
	return os.Getenv("MONGOURI")
}

func SpotifyCredentialsEnv() models.SpotifyCredentials {
	// return a struct with spotify credentials
	err := godotenv.Load()
	if err != nil {
		log.Default().Println("Error loading .env file, dropping Spotify integration")
	}
	return models.SpotifyCredentials{
		ClientId:     os.Getenv("SPOTIFY_CLIENT_ID"),
		ClientSecret: os.Getenv("SPOTIFY_CLIENT_SECRET"),
	}
}
