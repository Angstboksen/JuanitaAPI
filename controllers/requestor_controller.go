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
	"go.mongodb.org/mongo-driver/mongo"
)

var requestorCollection *mongo.Collection = configs.GetCollection(configs.DB, "requestors")
var validate = validator.New()

func CreateRequestor(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var requestor models.Requestor
	defer cancel()

	//validate the request body
	if err := c.BodyParser(&requestor); err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	//use the validator library to validate required fields
	if validationErr := validate.Struct(&requestor); validationErr != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": validationErr.Error()}})
	}

	exists := requestorCollection.FindOne(ctx, bson.M{"id": requestor.Id})
	if exists.Err() == nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": "Requestor already exists"}})
	}

	newRequestor := models.Requestor{
		Id:  requestor.Id,
		Tag: requestor.Tag,
	}

	result, err := requestorCollection.InsertOne(ctx, newRequestor)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusCreated).JSON(responses.MainResponse{Status: http.StatusCreated, Message: "success", Body: &fiber.Map{"data": result}})
}

func GetRequestors(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var requestors []models.Requestor
	defer cancel()

	results, err := requestorCollection.Find(ctx, bson.M{})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	for results.Next(ctx) {
		var requestor models.Requestor
		results.Decode(&requestor)
		requestors = append(requestors, requestor)
	}

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Size: len(requestors), Body: &fiber.Map{"data": requestors}})
}
