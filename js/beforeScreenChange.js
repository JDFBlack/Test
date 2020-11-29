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
  } else if (ui.toPage[0].id === "property_add_screen"){

      var propObj = ui.options.property;
      $("#prop_id").val(propObj.propid);
      if (propObj.propid !== (-1)){
          //restore values
          $("#address").val(propObj.address);
          $("#county").val(propObj.county);
          $("#city").val(propObj.city);
          $("#postcode").val(propObj.postcode);
          $("#marketvalue").val(propObj.marketvalue);
          $("#rent").val(propObj.rent);
          $("#expenses").val(propObj.expenses);
          $("#bedrooms").val(propObj.bedrooms).selectmenu("refresh"); //ensures repopulated to correct option
          $("#sqft").val(propObj.sqft);
          //$("#thumbnail").val(propObj.thumbnail);
          $("#propaddedit").html('Edit');
          $("#deleteproperty").show(); //show delete button
          $("#addedit").html('Edit Property');

      }else{
          $("#propaddedit").html('Add');
          $("#deleteproperty").hide(); //hide delete button
          $("#addedith1").html('Add Property');
          //Clear values
          $("#address").val(null);
          $("#county").val(null);
          $("#city").val(null);
          $("#postcode").val(null);
          $("#marketvalue").val(null);
          $("#rent").val(null);
          $("#expenses").val(null);
          $("#bedrooms").val("2").selectmenu("refresh"); //ensures repopulated to correct option
          $("#sqft").val(null);
          $("#thumbnail").val(null);
          
      } 
  }

});