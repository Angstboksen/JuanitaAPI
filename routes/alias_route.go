package routes

import (
	"juanitaapi/controllers"

	"github.com/gofiber/fiber/v2"
)

func AliasRoute(app *fiber.App) {
	//All routes related to aliases comes here
	app.Post("/alias/:guildId", controllers.CreateAlias)
	app.Get("/aliases/:guildId", controllers.GetAliases)

}
