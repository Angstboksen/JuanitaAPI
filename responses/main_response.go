package responses

import "github.com/gofiber/fiber/v2"

type MainResponse struct {
	Status  int        `json:"status"`
	Message string     `json:"message"`
	Size    int        `json:"size"`
	Body    *fiber.Map `json:"body"`
}
