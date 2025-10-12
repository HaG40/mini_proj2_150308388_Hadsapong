package controller

import (
	"encoding/json"
	"job-scraping-project/database"
	"job-scraping-project/models"
	"job-scraping-project/scrapers"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"gorm.io/gorm"
)

func contains(slice []string, value string) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}

func shuffle(data []scrapers.JobCard) {
	randomizer := rand.New(rand.NewSource(time.Now().UnixNano()))
	randomizer.Shuffle(len(data), func(i, j int) {
		data[i], data[j] = data[j], data[i]
	})
}

func JobsHandler(w http.ResponseWriter, r *http.Request) {
	// GET method
	if r.Method == http.MethodGet {

		// check error
		w.Header().Set("Content-type", "application/json")

		keyword := r.URL.Query().Get("keyword")
		pageStr := r.URL.Query().Get("page")
		source := r.URL.Query()["source"]
		bkkOnly := r.URL.Query().Get("bkk")
		if pageStr == "" {
			pageStr = "1"
		}
		page, err := strconv.Atoi(pageStr)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		bkkOnlyBool, err := strconv.ParseBool(bkkOnly)
		if err != nil {
			bkkOnlyBool = false
		}

		var jobbkkData, jobthaiData, jobthData []scrapers.JobCard
		var scrapeErr int

		scraperFuncs := []func(string, int, bool) ([]scrapers.JobCard, error){
			scrapers.ScrapingJobbkk,
			scrapers.ScrapingJobthai,
			scrapers.ScrapingJobTH,
		}

		var jobs []scrapers.JobCard
		for i, scrape := range scraperFuncs {
			jobs = nil
			jobs, err = scrape(keyword, page, bkkOnlyBool)
			if err != nil {
				log.Printf("Error scraping source #%d: %v", i+1, err)
				scrapeErr++
				continue
			}

			if i == 0 {
				jobbkkData = append(jobbkkData, jobs...)
			}
			if i == 1 {
				jobthaiData = append(jobthaiData, jobs...)
			}
			if i == 2 {
				jobthData = append(jobthData, jobs...)
			}
		}

		if scrapeErr >= len(scraperFuncs) {
			w.WriteHeader(http.StatusNotFound)
		}

		// collect data
		var data []scrapers.JobCard
		if contains(source, "all") {
			data = append(data, jobbkkData...)
			data = append(data, jobthaiData...)
			data = append(data, jobthData...)
			shuffle(data)
		}
		if contains(source, "jobbkk") {
			data = append(data, jobbkkData...)
		}
		if contains(source, "jobthai") {
			data = append(data, jobthaiData...)
		}
		if contains(source, "jobth") {
			data = append(data, jobthData...)
		}

		// convert to json
		if len(data) == 0 {
			w.Write([]byte("No data available"))
			w.WriteHeader(http.StatusNoContent)
			return
		} else {
			json.NewEncoder(w).Encode(data)
			w.WriteHeader(http.StatusOK)
			return
		}

	}
}

func AddFavoriteJobHandler(w http.ResponseWriter, r *http.Request) {

	if DB == nil {
		db := database.Connect()
		DB = db
	}

	if r.Method == http.MethodPost {

		var fav models.FavoriteJobs

		w.Header().Set("Content-type", "application/json")

		if err := json.NewDecoder(r.Body).Decode(&fav); err != nil {
			http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
			return
		}

		if err := DB.Create(&fav).Error; err != nil {
			http.Error(w, "Failed to save favorite job: "+err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(fav)
		w.WriteHeader(http.StatusOK)
		return
	} else {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}
}

func DeleteFavoriteJobHandler(w http.ResponseWriter, r *http.Request) {

	if DB == nil {
		db := database.Connect()
		DB = db
	}

	if r.Method == http.MethodDelete {

		var fav models.FavoriteJobs

		if err := json.NewDecoder(r.Body).Decode(&fav); err != nil {
			http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
			return
		}

		result := DB.Where(&fav).Unscoped().Delete(&models.FavoriteJobs{})
		if result.Error != nil {
			http.Error(w, "Failed to delete favorite job: "+result.Error.Error(), http.StatusInternalServerError)
			return
		}
		if result.RowsAffected == 0 {
			http.Error(w, "No matching favorite job found to delete", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-type", "application/json")
		json.NewEncoder(w).Encode(fav)
		w.WriteHeader(http.StatusOK)
		return
	} else {
		http.Error(w, "Only DELETE allowed", http.StatusMethodNotAllowed)
		return
	}
}

func GetFavoriteJobsHandler(w http.ResponseWriter, r *http.Request) {

	if DB == nil {
		db := database.Connect()
		DB = db
	}

	if r.Method == http.MethodGet {

		userID := r.URL.Query().Get("userId")

		var favorites []models.FavoriteJobs
		err := DB.Where("user_id = ?", userID).Find(&favorites).Error
		if err != nil {
			http.Error(w, "เกิดข้อผิดพลาดในการดึงข้อมูล", http.StatusInternalServerError)
			return
		}

		if len(favorites) == 0 {
			json.NewEncoder(w).Encode([]scrapers.JobCard{}) // Return empty array, not error
			return
		}

		var favoriteJobs []scrapers.JobCard
		for _, fav := range favorites {
			favoriteJobs = append(favoriteJobs, scrapers.JobCard{
				Title:    fav.Title,
				Company:  fav.Company,
				Location: fav.Location,
				Salary:   fav.Salary,
				URL:      fav.URL,
				Source:   fav.Source,
			})
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(favoriteJobs)

	} else {
		http.Error(w, "Only GET allowed", http.StatusMethodNotAllowed)
		return
	}
}

func CheckFavoriteJobHandler(w http.ResponseWriter, r *http.Request) {
	if DB == nil {
		db := database.Connect()
		DB = db
	}

	if r.Method == http.MethodGet {
		userID := r.URL.Query().Get("userId")
		url := r.URL.Query().Get("url")

		var fav models.FavoriteJobs
		err := DB.Where("user_Id = ? AND url = ?", userID, url).First(&fav).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				json.NewEncoder(w).Encode(map[string]bool{"favorited": false})
				return
			}
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]bool{"favorited": true})
		return
	}

	http.Error(w, "Only GET method allowed", http.StatusMethodNotAllowed)
}
