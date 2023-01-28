package routes

import (
	"juanitaapi/controllers"

	"github.com/gofiber/fiber/v2"
)

func RequestorRoute(app *fiber.App) {
	//All routes related to requestors comes here
	app.Post("/requestor", controllers.CreateRequestor)
	app.Get("/requestors", controllers.GetRequestors)
}
