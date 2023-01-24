package routes

import (
	"juanitaapi/controllers"

	"github.com/gofiber/fiber/v2"
)

func SearchRoute(app *fiber.App) {
	//All routes related to users comes here
	app.Post("/search", controllers.CreateSearch)
	app.Get("/searches", controllers.GetAllSearches)
}
