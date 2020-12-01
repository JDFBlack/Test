
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let placeSearch;
let autocomplete;

const componentForm = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  postal_town: "long_name",
  administrative_area_level_2: "short_name",
  administrative_area_level_1: "short_name",
  postal_code: "short_name",
};

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete( // Create the autocomplete object, restricting the search predictions to geographical location types.
    document.getElementById("autocomplete"),
    { types: ["address"],
          componentRestrictions: {country: "UK"},
    }
  );
  
  autocomplete.setFields(["address_component"]); // Avoid paying for data that you don't need by restricting the set of place fields that are returned to just the address components.
  
  
  autocomplete.addListener("place_changed", fillInAddress); // When the user selects an address from the drop-down, populate the address fields in the form.
}





function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();

  for (const component in componentForm) {
    document.getElementById(component).value = "";
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (const component of place.address_components) {
    const addressType = component.types[0];

    if (componentForm[addressType]) {
      const val = component[componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}
