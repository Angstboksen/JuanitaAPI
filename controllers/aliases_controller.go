package controllers

import (
	"context"
	"juanitaapi/models"
	"juanitaapi/responses"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateAlias(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	guildId := c.Params("guildId")
	var alias models.Alias
	defer cancel()

	if err := c.BodyParser(&alias); err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	if validationErr := validate.Struct(&alias); validationErr != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "error", Body: &fiber.Map{"data": validationErr.Error()}})
	}

	guild := guildCollection.FindOne(ctx, bson.M{"id": guildId})
	if guild.Err() != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "Guild does not exist", Body: &fiber.Map{"data": guild.Err().Error()}})
	}

	existsAlias := guildCollection.FindOne(ctx, bson.M{"id": guildId, "aliases.alias": alias.Alias})
	if existsAlias.Err() == nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "Alias already exists in guild", Body: &fiber.Map{"data": alias.Alias}})
	}

	existsPlaylist := guildCollection.FindOne(ctx, bson.M{"id": guildId, "alias.playlistid": alias.PlaylistId})
	if existsPlaylist.Err() == nil {
		var playlistAlias models.Alias
		existsPlaylist.Decode(&playlistAlias)
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "PlaylistID already has an alias in guild", Body: &fiber.Map{"data": playlistAlias.Alias}})
	}

	// ADD SPOTIFY VALIDATION

	newAlias := models.Alias{
		Name:       alias.Name,
		Alias:      alias.Alias,
		PlaylistId: alias.PlaylistId,
	}

	_, err := guildCollection.UpdateOne(ctx, bson.M{"id": guildId}, bson.M{"$push": bson.M{"aliases": newAlias}})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusCreated, Message: "success", Size: 1, Body: &fiber.Map{"data": newAlias}})
}

func GetAliases(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	guildId := c.Params("guildId")
	defer cancel()

	result, err := guildCollection.Find(ctx, bson.M{"id": guildId})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	var guild models.Guild
	result.Decode(&guild)

	return c.Status(http.StatusOK).JSON(responses.MainResponse{Status: http.StatusOK, Message: "success", Body: &fiber.Map{"data": guild.Aliases}})
}
