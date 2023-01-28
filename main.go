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
	routes.AliasRoute(app)
	routes.GuildRoute(app)
	routes.RequestorRoute(app)

	app.Listen(":8080")
}
