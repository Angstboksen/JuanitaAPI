package controllers

import (
	"context"
	"juanitaapi/configs"
	"juanitaapi/models"
	"juanitaapi/responses"
	"juanitaapi/utils"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var searchCollection *mongo.Collection = configs.GetCollection(configs.DB, "searches")

func CreateSearch(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var search models.Search
	defer cancel()

	//validate the request body
	if err := c.BodyParser(&search); err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	//use the validator library to validate required fields
	if validationErr := validate.Struct(&search); validationErr != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": validationErr.Error()}})
	}

	newSearch := models.Search{
		Title:     search.Title,
		Date:      search.Date,
		Requestor: search.Requestor,
		Guild:     search.Guild,
		Duration:  search.Duration,
	}

	result, err := searchCollection.InsertOne(ctx, newSearch)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusCreated).JSON(responses.MainResponse{Status: http.StatusCreated, Message: "success", Body: &fiber.Map{"data": result}})
}

func GetSearches(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	limit := c.Query("limit", "50")
	var searches []models.Search
	defer cancel()

	limitInt, err := strconv.ParseInt(limit, 10, 64)
	if err != nil {
		limitInt = 50
	}
	results, err := searchCollection.Find(ctx, bson.M{}, &options.FindOptions{Limit: &limitInt, Sort: bson.M{"date": -1}})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleSearch models.Search
		if err = results.Decode(&singleSearch); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
		}

		searches = append(searches, singleSearch)
	}

	return c.Status(http.StatusOK).JSON(
		responses.MainResponse{Status: http.StatusOK, Message: "success", Size: len(searches), Body: &fiber.Map{"data": searches}},
	)
}

func GetSearchesByRequestor(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	limit := c.Query("limit", "50")
	var searches []models.Search
	defer cancel()

	limitInt, err := strconv.ParseInt(limit, 10, 64)
	if err != nil {
		limitInt = 50
	}

	requestor := c.Params("requestorId")
	results, err := searchCollection.Find(ctx, bson.M{"requestor.id": requestor}, &options.FindOptions{Limit: &limitInt, Sort: bson.M{"date": -1}})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleSearch models.Search
		if err = results.Decode(&singleSearch); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
		}

		searches = append(searches, singleSearch)
	}

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Size: len(searches), Body: &fiber.Map{"data": searches}})
}

func GetSearchesByGuild(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	limit := c.Query("limit", "50")
	var searches []models.Search
	defer cancel()

	limitInt, err := strconv.ParseInt(limit, 10, 64)
	if err != nil {
		limitInt = 50
	}

	guild := c.Params("guildId")
	results, err := searchCollection.Find(ctx, bson.M{"guildId": guild}, &options.FindOptions{Limit: &limitInt, Sort: bson.M{"date": -1}})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleSearch models.Search
		if err = results.Decode(&singleSearch); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
		}

		searches = append(searches, singleSearch)
	}

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Size: len(searches), Body: &fiber.Map{"data": searches}})
}

func GetSearchesByRequestorAndGuild(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	limit := c.Query("limit", "50")
	var searches []models.Search
	defer cancel()

	limitInt, err := strconv.ParseInt(limit, 10, 64)
	if err != nil {
		limitInt = 50
	}

	requestor := c.Params("requestorId")
	guild := c.Params("guildId")
	results, err := searchCollection.Find(ctx, bson.M{"requestor.id": requestor, "guildId": guild}, &options.FindOptions{Limit: &limitInt, Sort: bson.M{"date": -1}})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleSearch models.Search
		if err = results.Decode(&singleSearch); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
		}

		searches = append(searches, singleSearch)
	}

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Size: len(searches), Body: &fiber.Map{"data": searches}})
}

func GetMostPlayedSearches(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	results, err := searchCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	defer results.Close(ctx)
	var songCounts []models.SongCount
	for results.Next(ctx) {
		var singleSearch models.Search
		if err = results.Decode(&singleSearch); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
		}

		songCounts = append(songCounts, models.SongCount{Title: singleSearch.Title, Url: singleSearch.Url, Duration: singleSearch.Duration, PlayCount: 1})
	}

	songCounts = utils.CountAndCompile(songCounts)

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Size: len(songCounts), Body: &fiber.Map{"data": songCounts}})
}

func GetMostPlayedSearchesByRequestor(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	requestor := c.Params("requestorId")
	results, err := searchCollection.Find(ctx, bson.M{"requestor.id": requestor})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	defer results.Close(ctx)
	var songCounts []models.SongCount
	for results.Next(ctx) {
		var singleSearch models.Search
		if err = results.Decode(&singleSearch); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
		}

		songCounts = append(songCounts, models.SongCount{Title: singleSearch.Title, Url: singleSearch.Url, Duration: singleSearch.Duration, PlayCount: 1})
	}

	songCounts = utils.CountAndCompile(songCounts)

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Size: len(songCounts), Body: &fiber.Map{"data": songCounts}})
}

func GetMostPlayedSearchesByGuild(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	guild := c.Params("guildId")
	results, err := searchCollection.Find(ctx, bson.M{"guild": guild})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	defer results.Close(ctx)
	var songCounts []models.SongCount
	for results.Next(ctx) {
		var singleSearch models.Search
		if err = results.Decode(&singleSearch); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
		}

		songCounts = append(songCounts, models.SongCount{Title: singleSearch.Title, Url: singleSearch.Url, Duration: singleSearch.Duration, PlayCount: 1})
	}

	songCounts = utils.CountAndCompile(songCounts)

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Size: len(songCounts), Body: &fiber.Map{"data": songCounts}})
}
