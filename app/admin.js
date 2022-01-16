class Admin {

    constructor() {
    }
    
    addRestaurant(){

        //Show the loader
        showAddingRestaurantsSpinner();
        //reset the alert and success on button click
        $("#restaurant-alert").addClass("d-none");
        $("#restaurant-success").addClass("d-none");

        let fields = [];
        
        const restaurant_name     = document.querySelector("#restaurant_name").value;
        const restaurant_address  = document.querySelector("#restaurant_address").value;
        const type_service        = document.querySelector("#type_service").value;
        const type_food           = document.querySelector("#type_food").value;
        const occasion            = document.querySelector("#occasion").value;
        const dining_option       = $('#dining_option').val();
        const average_expense     = document.querySelector("#average_expense").value;
        const qualtiy_food        = document.querySelector("#qualtiy_food").value;
        const ambiance            = document.querySelector("#ambiance").value;
        const quality_service     = document.querySelector("#quality_service").value;
        const cleanliness         = document.querySelector("#cleanliness").value;
        const speed_service       = document.querySelector("#speed_service").value;
        const value_money         = document.querySelector("#value_money").value;
        const allergy_information = document.querySelector("#allergy_information").value;

        let FieldsEmpty =false;
        FieldsEmpty = areFieldsEmpty(restaurant_name,restaurant_address, type_service,type_food,occasion,dining_option,average_expense,qualtiy_food,ambiance,quality_service,cleanliness,speed_service,value_money,allergy_information);

        if(FieldsEmpty){

            hideAddingRestaurantsSpinner();
            
            $("#restaurant-alert").removeClass("d-none");
        
        }
        else{
            
            $("#restaurant-alert").addClass("d-none");

            hideAddingRestaurantsSpinner();

            document.getElementById('restaurant-form').reset();

            firestore.collection("Restaurant").add({
                name:                 restaurant_name,
                address:              restaurant_address,
                type_service:         type_service,
                type_food:            type_food,
                occasion:             occasion,    
                dining:               dining_option,    //should be an array
                average_expense:      Number(average_expense),    
                quality_food:         qualtiy_food,    
                ambiance:             ambiance,    
                quality_service:      quality_service,    
                cleanliness:          cleanliness,    
                speed_service:        speed_service,    
                value_money:          value_money,
                allergy_information:  allergy_information,    
                average_rating:       Number(0),   
                number_rating:        Number(0),   
                hidden:               false    
            })
            .then((docRef) => {
                //console.log("Document written with ID: ", docRef.id);
                $("#restaurant-success").removeClass("d-none");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        }        
    }

    removeReviewText = function(ID,element){

        element.innerHTML = "Processing....";
    
        firestore.collection("Reviews").doc(ID).set({
          review_text: "Removed by Admin",
        }, 
        { merge: true }).then(() => {
          element.innerHTML = "Updated!";
          element.classList.add("btn-success");
          element.classList.add("disabled");
        });
    
      }
      
    toggleRestaurant (ID,hidden,element){

    element.innerHTML = "Processing....";

    if(hidden==true){
        firestore.collection("Restaurant").doc(ID).set({
        hidden: false,
        }, 
        { merge: true }).then(() => {
        element.innerHTML = "Updated!";
        element.classList.add("btn-success");
        element.classList.add("disabled");
        });
    }
    else{
        firestore.collection("Restaurant").doc(ID)
        .set({
        hidden: true,
        }, 
        { merge: true }).then(() => {
            //console.log("Updated Data");
        element.innerHTML = "Updated!";
        element.classList.add("disabled");                 
        });      
    }      


    }      
}