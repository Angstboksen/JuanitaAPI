package utils

import (
	"juanitaapi/models"
	"sort"
)

func CountAndCompile(collection []models.SongCount) []models.SongCount {
	for i := 0; i < len(collection); i++ {
		for j := i + 1; j < len(collection); j++ {
			if collection[i].Title == collection[j].Title {
				collection[i].PlayCount++
				collection = append(collection[:j], collection[j+1:]...)
				j--
			}
		}
	}

	sort.Slice(collection, func(i, j int) bool {
		return collection[i].PlayCount > collection[j].PlayCount
	})

	return collection
}

func GetStatsTuple(searches []models.Search) (int, models.SongCount) {
	var songCounts []models.SongCount
	var topSearch models.SongCount

	for _, search := range searches {
		songCounts = append(songCounts, models.SongCount{Title: search.Title, PlayCount: 1})
	}

	songCounts = CountAndCompile(songCounts)

	if len(songCounts) > 0 {
		topSearch = songCounts[0]
	}

	return len(songCounts), topSearch
}
