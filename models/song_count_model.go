package models

type SongCount struct {
	Title     string    `json:"title,omitempty" validate:"required"`
	Duration  int       `json:"duration,omitempty" validate:"required"`
	Url       string    `json:"url,omitempty" validate:"required"`
	PlayCount int       `json:"play_count,omitempty" validate:"required"`
	Requestor Requestor `json:"requestor,omitempty," validate:"required"`
}
