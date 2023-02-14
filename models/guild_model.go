package models

type Language string

const (
	English   Language = "en"
	Norwegian Language = "no"
	Molde     Language = "molde"
)

type Guild struct {
	Id             string   `json:"id,omitempty" validate:"required"`
	Name           string   `json:"name,omitempty" validate:"required"`
	PermissionRole string   `json:"permissionrole,omitempty" validate:"required"`
	Language       Language `json:"language,omitempty" validate:"required"`
	Aliases        []Alias  `json:"aliases,omitempty" validate:"required"`
}

type GuildLanguagePatch struct {
	Language Language `json:"language,omitempty" validate:"required"`
}

type GuildPermissionRolePatch struct {
	PermissionRole string `json:"permissionrole,omitempty" validate:"required"`
}
