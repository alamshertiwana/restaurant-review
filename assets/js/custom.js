//Restaurants Spinner
showLoadingRestaurantsSpinner = function(){
    $("#restaurant-loader").removeClass("d-none");
}

hideLoadingRestaurantsSpinner = function(){
    $("#restaurant-loader").addClass("d-none");
}

//Reviews Spinner
showAddingReviewSpinner = function(){
    $("#review-loader").removeClass("d-none");
}

hideAddingReviewSpinner = function(){
    $("#review-loader").addClass("d-none");
}

//Adding Restaurant Spinner
showAddingRestaurantsSpinner = function(){
    $("#add_restuarant_loader").removeClass("d-none");
}

hideAddingRestaurantsSpinner = function(){
    $("#add_restuarant_loader").addClass("d-none");
}

//Disable Restaurant Spinner
showHideRestaurantsSpinner = function(){
    $("#hide_restuarant_loader").removeClass("d-none");
}

hideHideRestaurantsSpinner = function(){
    $("#hide_restuarant_loader").addClass("d-none");
}

// Accound Details Spinner
showLoadingAccountSpinner = function(){
    $("#account_loader").removeClass("d-none");
}

hideLoadingAccountSpinner = function(){
    $("#account_loader").addClass("d-none");
}

//Disable Load More Restaurants buttons when no more restaurants available to download

disableLoadMoreButton = function(){
    $("#load_more_restaurants").addClass("disabled");
    $("#load_more_restaurants").text("No More Restaurants :(")    
}

updateLinksInHeader = function(logged_in=true){

    if(logged_in){

        $("#header_login_link").addClass("d-none");    
        $("#header_signup_link").addClass("d-none");
    
        $("#header_my_account_link").removeClass("d-none");    
        $("#header_logout_link").removeClass("d-none");
        
        //If user is an admin show link to dashboard
        firestore.collection("Admin").doc(firebase.auth().currentUser.uid).get().then(function(doc){
            if(doc && doc.exists){
                $("#header_admin_link").removeClass("d-none");
            }
        });
        
        
    }
    else{
        $("#header_login_link").removeClass("d-none");    
        $("#header_signup_link").removeClass("d-none");
    
        $("#header_my_account_link").addClass("d-none");    
        $("#header_logout_link").addClass("d-none");        
        $("#header_admin_link").addClass("d-none");        
    }
    

}

document.querySelector("#header_logout_link").addEventListener("click",function(e){

    e.preventDefault();

    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        updateLinksInHeader(false);
        window.location.href = "index.html";
      }).catch((error) => {
        // An error happened.
        console.log(error);
      });     

});

//Closing the overlay
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
    $("#restaurant-overlay-container").empty();   //clearing the overlay of previous details

  }

ratingToText = function(rating){
    if(rating == 1)
        return "Terrible";
    if(rating == 2)
        return "Poor";
    if(rating == 3)
        return "Average";
    if(rating == 4)
        return "Very Good";
    if(rating == 5)
        return "Excellent";
}

//Generating the content for the overlay both the Restaurant Details and Review form for now
printRestaurantDetails = function(doc){
    
        var post_block = '<div class="row">'
                            +'<div class="col">'
                                +'<h2 class="restaurant-name">'+doc.data().name+'</h2>'
                                +'<p class="restaurant-address"><strong>Address: </strong>'+doc.data().address+'</p>'
                                +'<p class="restaurant-average-rating"><strong>Rating: </strong>'+doc.data().average_rating.toFixed(2)+' <em>('+doc.data().number_rating+' Reviews)</em></p>'
                            +'</div>'
                        +'</div>'
                        +'<div class="row restaurant-page-details">'
                            +'<div class="col-md-4"><strong>Type of Food : </strong>'+doc.data().type_food+'</div>'
                            +'<div class="col-md-4"><strong>Type of Service : </strong>'+doc.data().type_service+'</div>'
                            +'<div class="col-md-4"><strong>Allergy Information : </strong>'+doc.data().allergy_information+'</div>'
                            +'<div class="col-md-4"><strong>Ambiance : </strong>'+doc.data().ambiance+'</div>'
                            +'<div class="col-md-4"><strong>Average Expense : </strong>'+doc.data().average_expense+'</div>'
                            +'<div class="col-md-4"><strong>Cleanliness : </strong>'+doc.data().cleanliness+'</div>'
                            +'<div class="col-md-4"><strong>Dining : </strong>'+doc.data().dining+'</div>'
                            +'<div class="col-md-4"><strong>Occasion : </strong>'+doc.data().occasion+'</div>'
                            +'<div class="col-md-4"><strong>Quality of Serivce : </strong>'+doc.data().quality_service+'</div>'
                            +'<div class="col-md-4"><strong>Quality of Food : </strong>'+doc.data().quality_food+'</div>'
                        +'</div>'
                        +'<div class="row mt-5">'
                            +'<div class="col">'
                                +'<h3>Leave Review</h3>'
                            +'</div>'
                        +'</div>'
                        +'<form id="add-review-form" >'
                            +'<div class="mb-3">'
                                +'<label for="user_review" class="form-label">Comment</label>'
                                +'<textarea id="user_review" class="form-control" rows="3"></textarea>'
                                +'<small class="form-text text-muted">Leave a review for the Restaurant.</small>'
                            +'</div>'
                            +'<label for="review_rating" class="form-label">Rating</label>'
                            +'<select id="review_rating" class="form-select mb-3">'
                                +'<option selected disabled="disabled" value="">Rating</option>'
                                +'<option value="5">Excellent</option>'
                                +'<option value="4">Very Good</option>'
                                +'<option value="3">Average</option>'
                                +'<option value="2">Poor</option>'
                                +'<option value="1">Terible</option>'
                            +'</select>'
                            +'<button id="add_review_button" type="button" onclick="addRestaurantReview(\''+doc.id+'\',\''+doc.data().name+'\')" class="btn btn-primary mb-3">Submit</button>'
                        +'</form>'
                        +'<div class="alert alert-warning d-none" id="add-review-alert" role="alert">Please Make Sure All Fields Are Filled!</div>'
                        +'<div class="alert alert-success d-none" id="add-review-success" role="alert">Review added Successfully!</div>'
                        +'<div id="review-loader" class="d-none"> <div class="spinner-border text-primary" role="status"> <span class="visually-hidden">Loading...</span> </div> <span class="processing-text">Processing....</span> </div>'
                        +'<div class="row g5">'
                        +'<h3>Reviews</h3>'
                        +'</div>'
                        +'<div id="overlay_review_list" class="row review-list g5">'
                        +'</div>';



        return post_block;
}

//Genearting the Review List
printReviewDetails = function(doc,new_class=""){
    
  var post_block = '<div class="col-12 review-box '+new_class+'">'
                        +'<p class="review-name">'+doc.data().reviewer_name+'</p>'
                        +'<p class="review-rating">Rating : '+ratingToText(doc.data().rating)+'</p>'
                        +'<p class="review-text">'+doc.data().review_text+'</p>'
                    +'</div>'

  return post_block;
}

//Called when you click on a button in the restaurant list
function openRestaurant(ID) {

    initial_flag = true;

    $("#restaurant-overlay-container").empty();   //clearing the overlay of previous details

    document.getElementById("myNav").style.width = "95%";

    firestore.collection("Restaurant").doc(ID).get().then((querySnapshot) => {
        if(querySnapshot && querySnapshot.exists){

            console.log(querySnapshot.data().name);
            $("#restaurant-overlay-container").prepend(printRestaurantDetails(querySnapshot));
        }
    });

    firestore.collection("Reviews").where("restuarant_ID","==",ID).orderBy("time", "desc").get().then((querySnapshot) => {

        if(querySnapshot.empty){
            $("#overlay_review_list").append('<p class="no-reviews">There are no reviews yet.</p>');
        }

        querySnapshot.forEach((doc) => {
    
            $("#overlay_review_list").append(printReviewDetails(doc));

        });
    
    });
    
    firestore.collection("Reviews").where("restuarant_ID","==",ID).orderBy("time", "desc").limit(1)
    .onSnapshot(function(querySnapshot){

        querySnapshot.forEach(function(doc) {

            if(initial_flag == true)
                initial_flag = false;

            else if(initial_flag == false){
                if(doc.data().time!=null){

                    console.log(doc.data());

                    $("#overlay_review_list").prepend(printReviewDetails(doc,"realtime-review"));

                    $(".no-reviews").empty();   //removing the there are no reviews for the restaurant text  

                }
            }                   
        });        

    });

}

//Update Restaurant Rating when Review is added

updateRestaurantRating = function(ID,review_rating){

    let new_average_rating = 0;
    let new_number_rating = 0

    firestore.collection("Restaurant").doc(ID).get().then((querySnapshot) => {
        if(querySnapshot && querySnapshot.exists){

            let old_average_rating  = Number(querySnapshot.data().average_rating);
            let old_number_rating   = Number(querySnapshot.data().number_rating);

            let total_rating = old_average_rating*old_number_rating;

            new_average_rating  = (total_rating+review_rating)/(old_number_rating+1);
            new_number_rating   = old_number_rating + 1;

            firestore.collection("Restaurant").doc(ID).set({
                average_rating: new_average_rating,
                number_rating:new_number_rating
                }, 
                { merge: true }).then(() => {
                    console.log("Updated Data");
            });            

        }
    });
}

//Adding a Review of Restaurant to the Firstore Database
function addRestaurantReview(resturant_ID,restaurant_name){

    showAddingReviewSpinner();

    //Reset Alerts
    $("#add-review-alert").addClass("d-none");
    $("#add-review-success").addClass("d-none");    
    
    const review            = document.querySelector("#user_review").value;
    const rating            = document.querySelector("#review_rating").value;
    const user_ID           = firebase.auth().currentUser.uid;
    const reviewer_name     = firebase.auth().currentUser.displayName;

    if(review == "" || rating == ""){
        hideAddingReviewSpinner();        
        $("#add-review-alert").removeClass("d-none");
        return;
    }

    firestore.collection("Reviews").add({
        user_ID:                user_ID,
        restuarant_ID:          resturant_ID,
        review_text:            review,
        rating:                 Number(rating),
        restaurant_name :       restaurant_name,
        reviewer_name :         reviewer_name,
        time :                  firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((docRef) => {

        updateRestaurantRating(resturant_ID,Number(rating))

        hideAddingReviewSpinner();

        document.getElementById('add-review-form').reset();
        
        $("#add-review-success").removeClass("d-none");        
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });     

}

/*My Account Details Functions to fetch details and display them on the form*/
function printUserDetails(doc){

    document.getElementById("account_display_name").innerHTML = doc.data().display_name;
    document.getElementById("account_email").innerHTML = firebase.auth().currentUser.email;
    document.getElementById("user_id").innerHTML = firebase.auth().currentUser.uid;

}

function showUserDetails(ID){
    firestore.collection("Users").doc(ID).get().then((querySnapshot) => {
        if(querySnapshot && querySnapshot.exists){

            printUserDetails(querySnapshot);
            hideLoadingAccountSpinner();               

        }
    });    
}

function getUserDetails(ID){

    let data;

    firestore.collection("Users").doc(ID).get().then((querySnapshot) => {
        if(querySnapshot && querySnapshot.exists){
            data = querySnapshot.data();
        }
    });     

    return data;
}
/*--------------My Account Details Functions to fetch details and display them on the form*/

/*My Reviews Page Functions */

function printReviewUser(doc,display_name){
    
  var post_block = '<div class="col review-box">'
                        +'<p class="review-name">'+display_name+'</p>'
                        +'<p class="review-rating">'+ratingToText(doc.data().rating)+'</p>'
                        +'<p class="review-text">'+doc.data().review_text+'</p>'
                        +'<p class="review-restaurant">'+doc.data().restaurant_name+'</p>'
                    +'</div>'

  return post_block;
}

function showUserReviews(ID){

    firestore.collection("Users").doc(ID).get().then((querySnapshot) => { 

        hideLoadingAccountSpinner(); 

        if(querySnapshot && querySnapshot.exists){

            const display_name = querySnapshot.data().display_name;

            firestore.collection("Reviews").where("user_ID","==",ID).get().then((querySnapshot) => {

                querySnapshot.forEach((doc) => {
            
                    $("#review_list").append(printReviewUser(doc,display_name));          
            
                });
            
            });             

        }
    });     
    
}

/*----------- My Revies Page Functions */