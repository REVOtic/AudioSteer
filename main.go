package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func saveHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Expected a POST Request:", http.StatusBadRequest)
		log.Printf("Expected a POST Request")
		return
	}

	jsonData, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error Reading Message Body: %v", err)
		http.Error(w, "Can't Read Message Body", http.StatusBadRequest)
		return
	}
	log.Printf(string(jsonData))

	// Create a new file saving the JSON Data
	newFile := ioutil.WriteFile("audioSteer.json", jsonData, 0777)

	if newFile != nil {
		fmt.Println(err)
	}

	// return that we have successfully saved our configuration!
	fmt.Fprint(w, http.StatusOK)
}

func setupRoutes() {
	// Handle File Upload Request - POST Only
	http.HandleFunc("/saveConfig", saveHandler)

	// Handle Any Request
	port := flag.String("p", "8080", "Port to Serve UI on")
	directory := flag.String("d", "./httpdocs", "Directory of Static HTML files to host")
	flag.Parse()

	fileServer := http.FileServer(http.Dir(*directory))
	http.Handle("/", fileServer)

	log.Printf("Serving %s on HTTP port: %s\n", *directory, *port)
	err := http.ListenAndServe(":"+*port, nil)
	if err != nil {
		panic(err)
	}
	log.Fatal(err)
}

func main() {
	setupRoutes()
}
