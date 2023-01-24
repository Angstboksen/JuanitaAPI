package models

type Requestor struct {
	Id  string `json:"id,omitempty"`
	Tag string `json:"tag,omitempty" validate:"required"`
}
