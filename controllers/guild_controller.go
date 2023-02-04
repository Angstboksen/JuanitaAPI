package controllers

import (
	"context"
	"juanitaapi/configs"
	"juanitaapi/models"
	"juanitaapi/responses"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var guildCollection *mongo.Collection = configs.GetCollection(configs.DB, "guilds")

// CreateGuild
// @Summary Create a new guild
// @ID CreateGuild
// @Tags Guild
// @Param body body models.Guild true "Guild to create"
// @Failure 500 {object} interface{}
// @Failure 400 {object} interface{}
// @Success 201 {object} models.Guild
// @Router /guild	[post]
func CreateGuild(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var guild models.Guild
	defer cancel()

	//validate the request body
	if err := c.BodyParser(&guild); err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	// use the validator library to validate required fields
	if validationErr := validate.Struct(&guild); validationErr != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": validationErr.Error()}})
	}

	newGuild := models.Guild{
		Id:             guild.Id,
		Name:           guild.Name,
		Language:       guild.Language,
		PermissionRole: guild.PermissionRole,
		Aliases:        guild.Aliases,
	}

	_, err := guildCollection.InsertOne(ctx, newGuild)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusCreated).JSON(newGuild)
}

// UpdateGuild
// @Summary Update a guild
// @ID UpdateGuild
// @Tags Guild
// @Param body body models.Guild true "Guild to update"
// @Failure 400 {object} interface{}
// @Success 200 {object} models.Guild
// @Router /guild/{guildId}	[put]
func UpdateGuild(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var guild models.Guild
	defer cancel()

	//validate the request body
	if err := c.BodyParser(&guild); err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	// use the validator library to validate required fields
	if validationErr := validate.Struct(&guild); validationErr != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": validationErr.Error()}})
	}

	newGuild := models.Guild{
		Id:             guild.Id,
		Name:           guild.Name,
		Language:       guild.Language,
		PermissionRole: guild.PermissionRole,
		Aliases:        guild.Aliases,
	}

	guildCollection.UpdateOne(ctx, bson.M{"id": guild.Id}, bson.M{"$set": newGuild})

	return c.Status(http.StatusOK).JSON(newGuild)
}

// UpdateGuildLanguage
// @Summary Update a guild language
// @ID UpdateGuildLanguage
// @Tags Guild
// @Param body body models.GuildLanguagePatch true "Guild language to update"
// @Failure 400 {object} interface{}
// @Success 200 {object} models.GuildLanguagePatch
// @Router /guild/{guildId}/language	[patch]
func UpdateGuildLanguage(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	guildId := c.Params("guildId")
	var language models.GuildLanguagePatch
	defer cancel()

	//validate the request body
	if err := c.BodyParser(&language); err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	// use the validator library to validate required fields
	if validationErr := validate.Struct(&language); validationErr != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": validationErr.Error()}})
	}

	result := guildCollection.FindOne(ctx, bson.M{"id": guildId})
	if result.Err() != nil {
		return c.Status(http.StatusNotFound).JSON(responses.MainResponse{Status: http.StatusNotFound, Message: "error", Body: &fiber.Map{"data": "No guild with that id found"}})
	}

	_, err := guildCollection.UpdateOne(ctx, bson.M{"id": guildId}, bson.M{"$set": bson.M{"language": language.Language}})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": result.Err().Error()}})
	}

	return c.Status(http.StatusOK).JSON(language)
}

// GetGuilds
// @Summary Get all guilds
// @ID GetGuilds
// @Tags Guild
// @Param limit query string false "Limit the amount of guilds returned"
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.Guild
// @Router /guilds	[get]
func GetGuilds(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	limit := c.Query("limit", "50")
	var guilds []models.Guild
	defer cancel()

	limitInt, err := strconv.ParseInt(limit, 10, 64)
	if err != nil {
		limitInt = 50
	}

	results, err := guildCollection.Find(ctx, bson.M{}, &options.FindOptions{Limit: &limitInt})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	for results.Next(ctx) {
		var guild models.Guild
		results.Decode(&guild)
		guilds = append(guilds, guild)
	}

	return c.Status(http.StatusOK).JSON(guilds)
}
