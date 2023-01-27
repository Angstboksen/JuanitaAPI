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
