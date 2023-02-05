package models

type Requestor struct {
	Id  string `json:"id,omitempty" validate:"required"`
	Tag string `json:"tag,omitempty" validate:"required"`
}
