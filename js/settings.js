var LTV, interestRate, mortgageTerm, taxRate, legalFees, graphFontColor = 'White';

function setVariables(){
  if (localStorage.LTV == null){
    LTV = 25;
  } else {LTV = localStorage.LTV;
  }
  if (localStorage.interestRate == null){
    interestRate = 2;
  } else {interestRate = localStorage.interestRate;
  }
  if (localStorage.mortgageTerm == null){
    mortgageTerm = 20;
  } else {mortgageTerm = localStorage.mortgageTerm;
  }
  if (localStorage.taxRate == null){
    taxRate = 19;
  } else {taxRate = localStorage.taxRate;
  }
  if (localStorage.legalFees == null){
    legalFees = 1000;
  } else {legalFees = localStorage.legalFees;
  }
}

function confirmClearData(){
  $("#confirmClearData").popup("open");
}

function clearData(){
  properties = []; //sets properties list array to empty
  localStorage.allProperties=JSON.stringify(properties); //updates local storage with empty array
  $.mobile.back(); //returns back to settings
  $.mobile.back(); //returns back to home
}

function confirmSettings(){
    LTV = $("#ltv").val();
    interestRate = $("#interestRate").val();
    mortgageTerm = $("#mortgageTerm").val();
    taxRate = $("#taxRate").val();
    legalFees = $("#legalFees").val();

    localStorage.LTV = LTV;
    localStorage.interestRate = interestRate;
    localStorage.mortgageTerm = mortgageTerm;
    localStorage.taxRate = taxRate;
    localStorage.legalFees = legalFees;
    $.mobile.back(); 
}

$(document).on('change','#themeFlipswitch', function(){
  if ($("#themeFlipswitch").val() == 'Light') {
    $("#mainTheme").html('<link rel="stylesheet" href="css/themes/light_theme.css" />');
    graphFontColor = 'DimGrey';
    graphGridColor = 'LightGrey';
    sessionStorage.theme = "Light";
  } else {
    $("#mainTheme").html('<link rel="stylesheet" href="css/themes/dark_theme.css" />');
    graphFontColor = 'White';
    graphGridColor = 'Grey';
    sessionStorage.theme = "Dark";
  }
})

function loadTheme(){
  if( sessionStorage.theme == "Light"){
    $("#mainTheme").html('<link rel="stylesheet" href="css/themes/light_theme.css" />'); 
    $("#themeFlipswitch").val("Light");
    graphFontColor = 'DimGrey';
    graphGridColor = 'LightGrey';
  } else {
    $("#mainTheme").html('<link rel="stylesheet" href="css/themes/dark_theme.css" />');
    $("#themeFlipswitch").val("Dark");
    graphFontColor = 'White';
    graphGridColor = 'Grey';
  }
}

