$(document).on("pagecontainerbeforechange",function(ev,ui){

  if(ui.toPage[0].id === "login_screen"){

    if (sessionStorage.isLogin === "YES"){ //if user logged in, don't display login page
          
        $.mobile.pageContainer.pagecontainer("change","#property_list",{transition:"slide"});

        ev.preventDefault();
     }
  }else if (ui.toPage[0].id === "property_list_screen"){
        initList();
  }else if ((ui.toPage[0].id === "property_screen")&&($(".ui-page-active").attr("id") === "settings_screen")){
          //function runs if transfering to property_screen FROM settings_screen
          viewProperty(localStorage.lastPropertyPageViewed);
  }else if (ui.toPage[0].id === "settings_screen"){
        $("#ltv").val(LTV);
        $("#interestRate").val(interestRate);
        $("#mortgageTerm").val(mortgageTerm);
        $("#taxRate").val(taxRate);
        $("#legalFees").val(legalFees);
  } else if (ui.toPage[0].id === "property_add_screen"){

      var propObj = ui.options.property;
      $("#prop_id").val(propObj.propid);
      if (propObj.propid !== (-1)){
          //restore values
          $("#autocomplete").val(null);
          $("#street_number").val(propObj.streetNum);
          $("#route").val(propObj.street);
          $("#administrative_area_level_1").val(propObj.county);
          $("#postal_town").val(propObj.city);
          $("#postal_code").val(propObj.postcode);
          $("#marketvalue").val(propObj.marketvalue);
          $("#rent").val(propObj.rent);
          $("#rentReview").val(propObj.rentReview);
          $("#rentReviewPeriod").val(propObj.rentReviewPeriod);
          $("#expenses").val(propObj.expenses);
          $("#bedrooms").val(propObj.bedrooms).selectmenu("refresh"); //ensures repopulated to correct option
          $("#hpi").val(propObj.hpi);
          $("#sqft").val(propObj.sqft);
          //$("#thumbnail").val(propObj.thumbnail);
          $("#propaddedit").html('Edit');
          $("#deleteproperty").show(); //show delete button
          $("#addedith1").html('Edit Property');

      }else{
          $("#propaddedit").html('Add');
          $("#deleteproperty").hide(); //hide delete button
          $("#addedith1").html('Add Property');
          //Clear values
          $("#autocomplete").val(null);
          $("#street_number").val(null);
          $("#route").val(null);
          $("#administrative_area_level_1").val(null);
          $("#postal_town").val(null);
          $("#postal_code").val(null);
          $("#marketvalue").val(null);
          $("#rent").val(null);
          $("#rentReview").val(2);
          $("#rentReviewPeriod").val(5);
          $("#expenses").val(null);
          $("#bedrooms").val("2").selectmenu("refresh"); //ensures repopulated to correct option
          $("#sqft").val(null);
          $("#hpi").val(2);
          $("#thumbnail").val(null);
          
      } 
  }

});