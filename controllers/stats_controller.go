package controllers

import (
	"context"
	"juanitaapi/models"
	"juanitaapi/responses"
	"juanitaapi/utils"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func GetRequestorStats(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var searches []models.Search
	var requestorStats = new(models.RequestorStats)
	defer cancel()

	requestorId := c.Params("requestorId")
	results, err := searchCollection.Find(ctx, bson.M{"requestor.id": requestorId})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	if results.RemainingBatchLength() == 0 {
		return c.Status(http.StatusNotFound).JSON(responses.MainResponse{Status: http.StatusNotFound, Message: "No requestors found", Size: 0, Body: &fiber.Map{"data": nil}})
	}

	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleSearch models.Search
		if err = results.Decode(&singleSearch); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
		}

		searches = append(searches, singleSearch)
	}

	distinct, topSearch := utils.GetStatsTuple(searches)
	requestorStats.Requestor = searches[0].Requestor
	requestorStats.DistictSongCount = distinct
	requestorStats.TopSearch = topSearch
	requestorStats.SearchCount = len(searches)

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "Requestor stats", Size: 1, Body: &fiber.Map{"data": requestorStats}})

}
