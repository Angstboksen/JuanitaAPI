package routes

import (
	"juanitaapi/controllers"

	"github.com/gofiber/fiber/v2"
)

func GetStats(app *fiber.App) {
	app.Get("/stats/:requestorId", controllers.GetRequestorStats)
}
