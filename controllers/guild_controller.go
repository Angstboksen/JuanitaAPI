package controllers

import (
	"context"
	"juanitaapi/configs"
	"juanitaapi/models"
	"juanitaapi/responses"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var guildCollection *mongo.Collection = configs.GetCollection(configs.DB, "guilds")

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

	result, err := guildCollection.InsertOne(ctx, newGuild)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusCreated).JSON(responses.MainResponse{Status: http.StatusCreated, Message: "success", Body: &fiber.Map{"data": result}})
}

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

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Body: &fiber.Map{"data": newGuild}})
}

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

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Size: 1, Body: &fiber.Map{"data": language}})
}

func GetGuilds(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var guilds []models.Guild
	defer cancel()

	results, err := guildCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	for results.Next(ctx) {
		var guild models.Guild
		results.Decode(&guild)
		guilds = append(guilds, guild)
	}

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Size: len(guilds), Body: &fiber.Map{"data": guilds}})
}