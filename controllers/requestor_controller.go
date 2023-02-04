package controllers

import (
	"context"
	"juanitaapi/configs"
	"juanitaapi/models"
	"juanitaapi/responses"
	"net/http"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var requestorCollection *mongo.Collection = configs.GetCollection(configs.DB, "requestors")
var validate = validator.New()

// CreateRequestor
// @Summary Create a new requestor
// @ID CreateRequestor
// @Tags Requestor
// @Param body body models.Requestor true "Requestor to create"
// @Failure 500 {object} interface{}
// @Failure 400 {object} interface{}
// @Success 201 {object} models.Requestor
// @Router /requestor	[post]
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

	_, err := requestorCollection.InsertOne(ctx, newRequestor)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusCreated).JSON(newRequestor)
}

// GetRequestors
// @Summary Get all requestors
// @ID GetRequestors
// @Tags Requestor
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.Requestor
// @Router /requestors	[get]
func GetRequestors(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	limit := c.Query("limit", "50")
	var requestors []models.Requestor
	defer cancel()

	limitInt, err := strconv.ParseInt(limit, 10, 64)
	if err != nil {
		limitInt = 50
	}

	results, err := requestorCollection.Find(ctx, bson.M{}, &options.FindOptions{Limit: &limitInt})

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	for results.Next(ctx) {
		var requestor models.Requestor
		results.Decode(&requestor)
		requestors = append(requestors, requestor)
	}

	return c.Status(http.StatusOK).JSON(requestors)
}
