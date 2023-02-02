package models

type AliasPost struct {
	Alias      string `json:"alias,omitempty" validate:"required"`
	PlaylistId string `json:"playlistid,omitempty" validate:"required"`
}

type Alias struct {
	Name       string `json:"name,omitempty" validate:"required"`
	Alias      string `json:"alias,omitempty" validate:"required"`
	PlaylistId string `json:"playlistid,omitempty" validate:"required"`
}
