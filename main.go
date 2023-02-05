package main

import (
	"juanitaapi/configs"
	"juanitaapi/routes"

	"github.com/gofiber/fiber/v2"
)

// @title JuanitaAPI
// @version 1.0
// @description Backend service for JuanitaMusic discord bot
// @license.name MIT
func main() {
	app := fiber.New()
	configs.ConnectDB()

	routes.SearchRoute(app)
	routes.AliasRoute(app)
	routes.GuildRoute(app)
	routes.RequestorRoute(app)
	routes.GetStats(app)
	app.Static("/docs", "./api/docs")
	app.Listen(":6000")
}
