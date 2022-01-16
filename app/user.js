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

}

