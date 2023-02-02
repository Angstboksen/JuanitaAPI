package models

type RequestorStats struct {
	Requestor        Requestor `json:"requestor,omitempty" validate:"required"`
	SearchCount      int       `json:"search_count,omitempty" validate:"required"`
	DistictSongCount int       `json:"distinct_song_count,omitempty" validate:"required"`
	TopSearch        SongCount `json:"top_search,omitempty" validate:"required"`
	TimePlayed       int       `json:"time_played,omitempty" validate:"required"`
}

type SearchAmount struct {
	Count int    `json:"count,omitempty" validate:"required"`
	Title string `json:"title,omitempty" validate:"required"`
}
