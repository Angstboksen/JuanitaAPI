package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Search struct {
	Id        primitive.ObjectID `json:"id,omitempty"`
	Title     string             `json:"title,omitempty" validate:"required"`
	Date      primitive.DateTime `json:"date,omitempty" validate:"required"`
	Requestor Requestor          `json:"requestor,omitempty" validate:"required"`
}
