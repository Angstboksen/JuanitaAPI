package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Search struct {
	Title     string             `json:"title,omitempty" validate:"required"`
	Date      primitive.DateTime `json:"date,omitempty" validate:"required"`
	Requestor Requestor          `json:"requestor,omitempty" validate:"required"`
	Guild     string             `json:"guild,omitempty" validate:"required"`
	Duration  int                `json:"duration,omitempty" validate:"required"`
	Url       string             `json:"url,omitempty" validate:"required"`
}
