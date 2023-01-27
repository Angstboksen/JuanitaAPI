package routes

import (
	"juanitaapi/controllers"

	"github.com/gofiber/fiber/v2"
)

func SearchRoute(app *fiber.App) {
	//All routes related to searches comes here
	app.Post("/search", controllers.CreateSearch)
	app.Get("/searches", controllers.GetSearches)
	app.Get("/searches/requestor/:requestorId", controllers.GetSearchesByRequestor)
	app.Get("/searches/guild/:guildId", controllers.GetSearchesByGuild)
	app.Get("/searches/requestor/:requestorId/guild/:guildId", controllers.GetSearchesByRequestorAndGuild)
	app.Get("/searches/mostplayed", controllers.GetMostPlayedSearches)
	app.Get("/searches/mostplayed/requestor/:requestorId", controllers.GetMostPlayedSearchesByRequestor)
	app.Get("/searches/mostplayed/guild/:guildId", controllers.GetMostPlayedSearchesByGuild)

	//All routes related to requestors comes here
	app.Post("/requestor", controllers.CreateRequestor)
	app.Get("/requestors", controllers.GetRequestors)

	//All routes related to aliases comes here
	app.Post("/alias/:guildId", controllers.CreateAlias)
	app.Get("/aliases/:guildId", controllers.GetAliases)

	//All routes related to guilds comes here
	app.Post("/guild", controllers.CreateGuild)
	app.Get("/guilds", controllers.GetGuilds)
}
