class User {

  constructor() {
  } 

  getRestaurants(){
    firestore.collection("Restaurant").limit(restaurant_pagination).get().then((querySnapshot) => {

        startAfterDoc = querySnapshot.docs[querySnapshot.docs.length-1];

        hideLoadingRestaurantsSpinner();

        querySnapshot.forEach((doc) => {

          $("#restaurant-list").append(printRestaurantBox(doc));

        });

      });      
  }

  filterRestaurants(){

    let filterQuery = firestore.collection("Restaurant");

    const type_food_filter      = document.querySelector("#type_food").value;
    const occasion              = document.querySelector("#occasion").value;
    const average_expense       = Number(document.querySelector("#average_expense").value);

    if(type_food_filter!="")
        filterQuery = filterQuery.where("type_food", "==", type_food_filter);
    if(occasion!="")
        filterQuery = filterQuery.where("occasion","==",occasion);
    if(average_expense!="")
        filterQuery = filterQuery.where("average_expense", "<=", average_expense);


    filterQuery.get()
    .then(function(querySnapshot) {

        startAfterDoc = querySnapshot.docs[querySnapshot.docs.length-1];
        //console.log(querySnapshot.docs.length);

        hideLoadingRestaurantsSpinner();
        
        if(querySnapshot.docs.length <restaurant_pagination){
            //disableLoadMoreButton();
        }
        
        if(querySnapshot.docs.length == 0){
          //console.log("There are no results.")
          $("#restaurant-list").append('<p class="restaurant-no-results">There are no results for this fiter!</p>');
        }
        
        querySnapshot.forEach(function(doc) {

            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

            $("#restaurant-list").append(printRestaurantBox(doc));
            
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  }

  loadMoreRestaurants(){
    let filterQuery = firestore.collection("Restaurant");

    const type_food_filter      = document.querySelector("#type_food").value;
    const occasion              = document.querySelector("#occasion").value;
    const average_expense       = Number(document.querySelector("#average_expense").value);

    if(type_food_filter!="")
        filterQuery = filterQuery.where("type_food", "==", type_food_filter);
    if(occasion!="")
        filterQuery = filterQuery.where("occasion","==",occasion);
    if(average_expense!="")
        filterQuery = filterQuery.where("average_expense", "<=", average_expense);

    filterQuery = filterQuery.startAfter(startAfterDoc).limit(restaurant_pagination);


    filterQuery.get()
    .then(function(querySnapshot) {

        startAfterDoc = querySnapshot.docs[querySnapshot.docs.length-1];
        //console.log(querySnapshot.docs.length);

        hideLoadingRestaurantsSpinner();
        
        if(querySnapshot.docs.length <restaurant_pagination){
            disableLoadMoreButton();
        }
        
        querySnapshot.forEach(function(doc) {

            $("#restaurant-list").append(printRestaurantBox(doc));
            
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });      
  }

  showUserDetails(ID){
    firestore.collection("Users").doc(ID).get().then((querySnapshot) => {
        if(querySnapshot && querySnapshot.exists){

            printUserDetails(querySnapshot);
            hideLoadingAccountSpinner();               

        }
    });    
}

showUserReviews(ID){

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
 
 checkUserInDB = function(user){

    firestore.collection("Users").doc(user.uid).get().then(function(doc){
        if(doc && doc.exists){
            //console.log("Document Exists");
            window.location.href = "index.html";
        }
        else{
            //console.log("Document Does Not Exist");
            firestore.collection("Users").doc(user.uid).set({
                uid: user.uid,
                display_name: user.displayName,
                email: user.email,
            })
            .then(function() {
                //console.log("User Added to Database");
                window.location.href = "index.html";
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);                    
            });

            // firebase.auth().currentUser.sendEmailVerification().then(function() {
            // // Email sent.
            // }).catch(function(error) {
            // // An error happened.
            // });                                        
        }
    });
  }
  
  openRestaurant(ID) {

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
    
 addRestaurantReview(resturant_ID,restaurant_name){

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

}

