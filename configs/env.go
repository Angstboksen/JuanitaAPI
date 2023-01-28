package configs

import (
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
