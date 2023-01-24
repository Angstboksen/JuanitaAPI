package main

import (
	"juanitaapi/configs"
	"juanitaapi/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	configs.ConnectDB()
	routes.SearchRoute(app)

	app.Listen(":6000")
}
