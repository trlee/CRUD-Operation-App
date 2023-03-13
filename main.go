package main

import (
	"database/sql"
	"embed"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

var (
	db  *sql.DB
	err error
)

type Leave struct {
	ID     int
	Type   string
	Date   string
	Reason string
	FromDB bool
}

type PageData struct {
	PageTitle string
	Leave     []Leave
}

type data struct {
	Type   string `json:"type"`
	Date   string `json:"date"`
	Reason string `json:"reason"`
}

type jsonResponse struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

var staticFiles embed.FS

// PostgreSQL Credentials
const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "rootroot"
	dbname   = "testapp"
)

// Starting/Connecting to the DB
func init() {
	connStr := fmt.Sprintf("host = %s port = %d user = %s password = %s dbname = %s sslmode = disable", host, port, user, password, dbname)
	db, err = sql.Open("postgres", connStr)

	if err != nil {
		panic(err)
	}

	if err = db.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("Connected to Postgres!")
}

// Hosting the Server Web Pages
func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.HandleFunc("/form", baseForm)
	http.HandleFunc("/insert", addLeaves)
	http.ListenAndServe(":8080", nil)
}

func baseForm(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(404), http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT * FROM public.\"CRUD_Leave_App\"")
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	leaves := make([]Leave, 0)

	for rows.Next() {
		leave := new(Leave)
		err := rows.Scan(&leave.ID, &leave.Type, &leave.Date, &leave.Reason, &leave.FromDB)
		if leave.Type == "1" {
			leave.Type = "Annual Leave"
		} else {
			leave.Type = "Medical Leave"
		}
		if err != nil {
			fmt.Println(err)
			http.Error(w, http.StatusText(500), 500)
			return
		}
		leaves = append(leaves, *leave)
	}

	p := PageData{PageTitle: "Test Form", Leave: leaves}
	t, _ := template.ParseFiles("form.gohtml")
	t.Execute(w, p)
}

// Handling the post request
func addLeaves(w http.ResponseWriter, r *http.Request) {
	var p []data

	if r.Method != "POST" {
		http.Error(w, http.StatusText(404), http.StatusMethodNotAllowed)
		return
	}

	log.Println(r.Body)

	maxBytes := 1048576 // one megabyte
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	dec := json.NewDecoder(r.Body)
	err := dec.Decode(&p)
	if err != nil {
		log.Println("Error! ", err)
	}

	log.Println("Data: ", p[0])

	for i := 0; i < len(p); i++ {
		log.Println("Inserting to DB: ", p[i])
		insertQuery := `INSERT INTO public."CRUD_Leave_App" ("type", "date", "reason") VALUES($1, $2, $3)`
		_, err := db.Exec(insertQuery, p[i].Type, p[i].Date, p[i].Reason)
		if err != nil {
			log.Println("DB Error!", err)
		}
	}

	answer := jsonResponse{
		Error:   false,
		Message: "All Leave Applications Inserted",
	}

	out, err := json.Marshal(answer)
	if err != nil {
		log.Println("JSON Marshal error: ", err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	_, err = w.Write(out)
	if err != nil {
		log.Println("Response error: ", err)
	}
}
