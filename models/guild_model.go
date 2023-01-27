package models

type Guild struct {
	Id             string  `json:"id,omitempty" validate:"required"`
	Name           string  `json:"name,omitempty" validate:"required"`
	Language       string  `json:"language,omitempty" validate:"required"`
	PermissionRole string  `json:"permissionrole,omitempty" validate:"required"`
	Aliases        []Alias `json:"aliases,omitempty" validate:"required"`
}
