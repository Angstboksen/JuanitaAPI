package controllers

import (
	"context"
	"juanitaapi/configs"
	"juanitaapi/models"
	"juanitaapi/responses"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var searchCollection *mongo.Collection = configs.GetCollection(configs.DB, "searches")
var validate = validator.New()

func CreateSearch(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var search models.Search
	defer cancel()

	//validate the request body
	if err := c.BodyParser(&search); err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.SearchResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	//use the validator library to validate required fields
	if validationErr := validate.Struct(&search); validationErr != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.SearchResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": validationErr.Error()}})
	}

	newSearch := models.Search{
		Id:        primitive.NewObjectID(),
		Title:     search.Title,
		Date:      search.Date,
		Requestor: search.Requestor,
	}

	result, err := searchCollection.InsertOne(ctx, newSearch)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.SearchResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusCreated).JSON(responses.SearchResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": result}})
}

func GetAllSearches(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var searches []models.Search
	defer cancel()

	results, err := searchCollection.Find(ctx, bson.M{})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.SearchResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	//reading from the db in an optimal way
	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleSearch models.Search
		if err = results.Decode(&singleSearch); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.SearchResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
		}

		searches = append(searches, singleSearch)
	}

	return c.Status(http.StatusOK).JSON(
		responses.SearchResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": searches}},
	)
}
