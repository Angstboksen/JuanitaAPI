package routes

import (
	"juanitaapi/controllers"

	"github.com/gofiber/fiber/v2"
)

func GuildRoute(app *fiber.App) {
	//All routes related to guilds comes here
	app.Post("/guild", controllers.CreateGuild)
	app.Put("/guild/:guildId", controllers.UpdateGuild)
	app.Put("/guild/:guildId/language", controllers.UpdateGuildLanguage)
	app.Get("/guilds", controllers.GetGuilds)
}
