package controllers

import (
	"context"
	"juanitaapi/integration"
	"juanitaapi/models"
	"juanitaapi/responses"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

// CreateAlias
// @Summary Create a new alias for a playlist URI
// @ID CreateAlias
// @Tags Alias
// @Param guildId path string true "Discord ID of the guild"
// @Param body body models.AliasPost true "Alias to create"
// @Failure 500 {object} interface{}
// @Failure 400 {object} interface{}
// @Success 201 {object}  models.Alias
// @Router /alias/{guildId}	[post]
func CreateAlias(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	guildId := c.Params("guildId")
	var alias models.AliasPost
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
	playlistId := strings.Split(alias.PlaylistId, ":")[2]
	existsPlaylist := guildCollection.FindOne(ctx, bson.M{"id": guildId, "alias.playlistid": playlistId})
	if existsPlaylist.Err() == nil {
		var playlistAlias models.Alias
		existsPlaylist.Decode(&playlistAlias)
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "PlaylistID already has an alias in guild", Body: &fiber.Map{"data": playlistAlias.Alias}})
	}

	playlist, wrong := integration.GetPlaylist(playlistId)

	if wrong {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "Playlist does not exist", Body: &fiber.Map{"data": playlistId}})
	}

	newAlias := models.Alias{
		Name:       playlist.Name,
		Alias:      alias.Alias,
		PlaylistId: playlistId,
	}

	_, err := guildCollection.UpdateOne(ctx, bson.M{"id": guildId}, bson.M{"$push": bson.M{"aliases": newAlias}})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.MainResponse{Status: http.StatusInternalServerError, Message: "error", Body: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusCreated).JSON(newAlias)
}

// GetAliases
// @Summary Get all aliases for a guild
// @ID GetAliases
// @Tags Alias
// @Param guildId path string true "Discord ID of the guild"
// @Failure 400 {object} interface{}
// @Success 200 {object} []models.Alias
// @Router /aliases/{guildId}	[get]
func GetAliases(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	guildId := c.Params("guildId")
	defer cancel()

	result := guildCollection.FindOne(ctx, bson.M{"id": guildId})
	if result.Err() != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "Guild does not exist", Body: &fiber.Map{"data": result.Err().Error()}})
	}

	var guild models.Guild
	result.Decode(&guild)

	return c.Status(http.StatusOK).JSON(guild.Aliases)
}

// GetByAlias
// @Summary Get an alias object by alias string if exists
// @ID GetByAlias
// @Tags Alias
// @Param guildId path string true "Discord ID of the guild"
// @Param alias path string true "Alias to get"
// @Failure 400 {object} interface{}
// @Success 200 {object} models.Alias
// @Router /alias/{guildId}/{alias}	[get]
func GetByAlias(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	guildId := c.Params("guildId")
	aliasString := c.Params("alias")
	defer cancel()
	var guild models.Guild

	var result = guildCollection.FindOne(ctx, bson.M{"id": guildId, "aliases.alias": aliasString})
	if result.Err() != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.MainResponse{Status: http.StatusBadRequest, Message: "Alias does not exist", Body: &fiber.Map{"data": result.Err().Error()}})
	}

	result.Decode(&guild)

	var alias models.Alias
	for _, a := range guild.Aliases {
		if a.Alias == aliasString {
			alias = a
		}
	}

	return c.Status(http.StatusOK).JSON(alias)
}
