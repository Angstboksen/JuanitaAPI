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

// CreateSearch
// @Summary Create a new search
// @ID CreateSearch
// @Tags Search
// @Param body body models.Search true "Search to create"
// @Failure 500 {object} interface{}
// @Failure 400 {object} interface{}
// @Success 201 {object} models.Search
// @Router /search	[post]
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

	// check if the requestor exists in the database
	var requestor models.Requestor
	err := searchCollection.FindOne(ctx, bson.M{"requestor.id": search.Requestor.Id}).Decode(&requestor)
	if err != nil {
		newRequestor := models.Requestor{
			Id:  search.Requestor.Id,
			Tag: search.Requestor.Tag,
		}
		_, err := requestorCollection.InsertOne(ctx, newRequestor)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
		}
	}

	_, err = requestorCollection.UpdateOne(ctx, bson.M{"requestor.id": search.Requestor.Id}, bson.M{"$set": bson.M{"requestor.tag": search.Requestor.Tag}})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	newSearch := models.Search{
		Title:     search.Title,
		Date:      search.Date,
		Requestor: search.Requestor,
		Guild:     search.Guild,
		Duration:  search.Duration,
		Url:       search.Url,
	}

	_, err = searchCollection.InsertOne(ctx, newSearch)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusCreated).JSON(newSearch)
}

// GetSearches
// @Summary Get all searches
// @ID GetSearches
// @Tags Search
// @Param limit query string false "Limit of results"
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.Search
// @Router /search	[get]
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

	return c.Status(http.StatusOK).JSON(searches)
}

// GetSearchesByRequestor
// @Summary Get all searches by requestor
// @ID GetSearchesByRequestor
// @Tags Search
// @Param requestorId path string true "Requestor ID"
// @Param limit query string false "Limit of results"
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.Search
// @Router /search/requestor/{requestorId}	[get]
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

	return c.Status(http.StatusOK).JSON(searches)
}

// GetSearchesByGuild
// @Summary Get all searches by guild
// @ID GetSearchesByGuild
// @Tags Search
// @Param guildId path string true "Guild ID"
// @Param limit query string false "Limit of results"
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.Search
// @Router /search/guild/{guildId}	[get]
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

	return c.Status(http.StatusOK).JSON(searches)
}

// GetSearchesByRequestorAndGuild
// @Summary Get all searches by requestor and guild
// @ID GetSearchesByRequestorAndGuild
// @Tags Search
// @Param requestorId path string true "Requestor ID"
// @Param guildId path string true "Guild ID"
// @Param limit query string false "Limit of results"
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.Search
// @Router /search/requestor/{requestorId}/guild/{guildId}	[get]
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

	return c.Status(http.StatusOK).JSON(searches)
}

// GetMostPlayedSearches
// @Summary Get most played searches
// @ID GetMostPlayedSearches
// @Tags Search
// @Param limit query string false "Limit of results"
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.SongCount
// @Router /search/mostplayed	[get]
func GetMostPlayedSearches(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	limit := c.Query("limit", "50")
	defer cancel()

	limitInt, err := strconv.ParseInt(limit, 10, 64)
	if err != nil {
		limitInt = 50
	}

	results, err := searchCollection.Find(ctx, bson.M{}, &options.FindOptions{Limit: &limitInt})
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

	return c.Status(http.StatusOK).JSON(songCounts)
}

// GetMostPlayedSearchesByRequestor
// @Summary Get most played searches by requestor
// @ID GetMostPlayedSearchesByRequestor
// @Tags Search
// @Param requestorId path string true "Requestor ID"
// @Param limit query string false "Limit of results"
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.SongCount
// @Router /search/mostplayed/requestor/{requestorId}	[get]
func GetMostPlayedSearchesByRequestor(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	limit := c.Query("limit", "50")
	defer cancel()

	limitInt, err := strconv.ParseInt(limit, 10, 64)
	if err != nil {
		limitInt = 50
	}

	requestor := c.Params("requestorId")
	results, err := searchCollection.Find(ctx, bson.M{"requestor.id": requestor}, &options.FindOptions{Limit: &limitInt})
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

	return c.Status(http.StatusOK).JSON(songCounts)
}

// GetMostPlayedSearchesByGuild
// @Summary Get most played searches by guild
// @ID GetMostPlayedSearchesByGuild
// @Tags Search
// @Param guildId path string true "Guild ID"
// @Param limit query string false "Limit of results"
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.SongCount
// @Router /search/mostplayed/guild/{guildId}	[get]
func GetMostPlayedSearchesByGuild(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	limit := c.Query("limit", "50")
	defer cancel()

	limitInt, err := strconv.ParseInt(limit, 10, 64)
	if err != nil {
		limitInt = 50
	}

	guild := c.Params("guildId")
	results, err := searchCollection.Find(ctx, bson.M{"guild": guild}, &options.FindOptions{Limit: &limitInt})
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

	return c.Status(http.StatusOK).JSON(songCounts)
}
