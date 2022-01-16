# Restaurant Review System

This is a restaurant review system. Developed in HTML, CSS, Javascript and use Google Firebase Firestore as the Database.

## Folder Structure
The application has the following folder structure.
```
restaurant-review
├── app
│   ├── admin.js
│   ├── config.js
│   ├── facade.js
│   └── manager.js
│   └── user.js
├── assets
│   ├── css
│   │   └── style.css
│   ├── js
│   │   └── custom.js
├── add-restaurant.html
├── changelog.txt
├── delete-review.html
├── hide-restaurant.html
├── index.html
├── login.html
├── my-account.html
├── my-reviews.html
└── README.md
└── top-restaurants.html
```

The "app" directory contains all the .js files responsible for interacting with the database.

The "assets" directory contains the general assets files such as styles, custom.js and in the future any static images will be added here. 

The "*.html" file in the main directory are the layouts for the website.

The "changelog.txt" contains the revision history of the application.

## Features

- User Sign Up/ Sign In
- Add Restaurant
- Add Review to a Restaurant
- Filter Restaurants
- Remove Review
- Hide Restaurants
- Add Restaurants

## Installation

Download the project and update the "firebaseConfig" in the app/config.js file with the the details of your firebase project. [Add Firebase to your JavaScript project ](https://firebase.google.com/docs/web/setup)   
