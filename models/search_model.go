package models

type Search struct {
	Title     string    `json:"title,omitempty" validate:"required"`
	Date      string    `json:"date,omitempty" validate:"required"` // TODO: Change to date
	Requestor Requestor `json:"requestor,omitempty" validate:"required"`
	Guild     string    `json:"guild,omitempty" validate:"required"`
	Duration  int       `json:"duration,omitempty" validate:"required"`
	Url       string    `json:"url,omitempty" validate:"required"`
}
