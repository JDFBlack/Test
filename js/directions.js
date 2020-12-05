function directionsProperty(i){ //function for getting directions from current loc to property i
  if(sessionStorage.location == null){ //if no location in current session, generate newlocation var
    navigator.geolocation.getCurrentPosition(function( position ){
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      var newlocation = latitude + "," + longitude;
      sessionStorage.location = newlocation
      generateDirectionsScreen(i, newlocation); //generate property page using newlocation as origin.
    });
  } else {
    generateDirectionsScreen(i, sessionStorage.location); //if location in session, use that.
  }
}


function generateDirectionsScreen(i, origin){
      var propObj = {};
      var destination = properties[i].postcode;
      propObj = properties[i];

    $("#property_directions_content").empty(); //Clears all nodes in the property_breakdown div, otherwise would keep adding content each time clicked

    $("#propertydirectionsh3").html(properties[i].address); //changes header text

    $("#property_directions_content").append('<div id="embedmap-display"><iframe style="height:75vh;width:100%;border:0;" frameborder="0" src="https://www.google.com/maps/embed/v1/directions?origin='+origin+'&destination='+destination+'&zoom=12&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"></iframe></div>');
    $.mobile.pageContainer.pagecontainer("change","#property_directions",{property:propObj, transition:"slide"})
}