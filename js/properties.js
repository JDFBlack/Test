var properties = []; //empty global array to store properties added below.

      function addProperty(){
        var propid = $("#prop_id").val();
        var s = parseInt(propid); 
        var streetNum = $("#street_number").val();
        var street = $("#route").val();
        var locality = $("#locality").val();
        var county = $("#administrative_area_level_1").val();
        var city = $("#postal_town").val();
        var district = $("#administrative_area_level_2").val();
        var postcode = $("#postal_code").val();
        var marketvalue = $("#marketvalue").val();
        var rent = $("#rent").val();
        var expenses = $("#expenses").val();
        var bedrooms = $("#bedrooms").val();
        var sqft = $("#sqft").val();
        var thumbnail = $("#thumbnail").val();
        var hpi = $("#hpi").val();
        var rentReview = $("#rentReview").val();
        var rentReviewPeriod = $("#rentReviewPeriod").val();
        var address = streetNum + " " + street;

        var annualRent = rent*12;
        var yield = ((annualRent/marketvalue)*100);
        var ppsqft = marketvalue/sqft;
        var propObj = {};

        if(s === -1){ // IF NEW
          propObj = {propid: properties.length, address:address, streetNum:streetNum, street:street, locality: locality, county:county,city:city, district:district, postcode:postcode,marketvalue:marketvalue,rent:rent,expenses:expenses,bedrooms:bedrooms,sqft:sqft,yield:yield,ppsqft:ppsqft, annualRent:annualRent, hpi:hpi, rentReview: rentReview, rentReviewPeriod: rentReviewPeriod, thumbnail:thumbnail};
          properties.push(propObj);

        } else { //IF EDIT
          propObj = {propid: propid, streetNum:streetNum, address:address, street:street, locality: locality, county:county,city:city,district:district, postcode:postcode,marketvalue:marketvalue,rent:rent,expenses:expenses,bedrooms:bedrooms,sqft:sqft,yield:yield,ppsqft:ppsqft,annualRent:annualRent, hpi:hpi, rentReview: rentReview, rentReviewPeriod: rentReviewPeriod, thumbnail:thumbnail};
          properties.splice(propid,1,propObj);
 
        }
        
        
        localStorage.allProperties = JSON.stringify(properties);
        $.mobile.back();
        initList(); //runs list function to update the list each time prop added
      }

      function initList(){ //creates property list view

        if(localStorage.allProperties){
          $("#property_list").empty();
          properties = JSON.parse(localStorage.allProperties);
          for(var i = 0; i<properties.length; i++){
            
            $("#property_list").append('<li id='+i+'><a href="javascript:viewPropertyFromHomeScreen('+i+')">' + 
              '<img src="'+properties[i].thumbnail+'"><h2>' + properties[i].address + 
              '</h2><p>Market Value: £' + properties[i].marketvalue + 
              '</p><p>Annual Rent: £' + properties[i].annualRent + '  Yield: ' + properties[i].yield.toFixed(2) + 
              '% </p><p>Price per SqFt: £' + properties[i].ppsqft.toFixed(2) + 
            '</p></a><a href="javascript:addEditDeleteProperty('+i+')">Edit</a></li>'); //appends, also gives edit delete function value i
          }
          $("#property_list").listview("refresh"); //refreshes element, otherwise won't display as a list view
        }
      }

      function addEditDeleteProperty(index){
            
          var propObj = {};
          if (index === -1){
            //for new record
            propObj = {propid:-1};
          }else{
            //edit/delete existing record
            propObj = properties[index];
          }  
          
          $.mobile.pageContainer.pagecontainer("change","#property_add_screen",{property:propObj, transition:"slide"})
      }

      function deleteProperty(){
          $("#confirmdelete").popup("open");
      }

      function deleteConfirm(){
        var propidString = $("#prop_id").val();
        var propidInt = parseInt(propidString);

        properties.splice(propidInt,1); //updates properties array by removing element
    
        //reindexing
        for(var i = 0; i<properties.length; i++){
            var propObj = properties[i];
            propObj.propid = i; //change propid to latest value 
            properties[i] = propObj; //reindex

        }
        localStorage.allProperties = JSON.stringify(properties);
        
        $.mobile.back();
        $.mobile.back();

      }

      function StampDuty(MV) {
        var SDLT = 0;
        
        var excempt = 40000;
        var band1 = 125000;
        var band2 = 250000;
        var band3 = 925000;
        var band4 = 1500000;
        
        var TaxBand1 = band1*0.03;
        var TaxBand2 = (band2-band1)*0.05;
        var TaxBand3 = (band3-band2)*0.08;
        var TaxBand4 = (band4-band3)*0.13;

        if(MV > band4) {
          SDLT = ((MV - band4)*0.15) + TaxBand1 + TaxBand2 + TaxBand3 + TaxBand4;
          return SDLT;
         } else if (MV > band3) {
          SDLT = ((MV - band3)*0.13) + TaxBand1 + TaxBand2 + TaxBand3;
          return SDLT;
        } else if (MV > band2) {
          SDLT = ((MV - band2)*0.08) + TaxBand1 + TaxBand2;
          return SDLT;
        } else if (MV > band1) {
          SDLT = ((MV - band1)*0.05) + TaxBand1;
          return SDLT;
        } else if (MV >= excempt){
          SDLT = MV*0.03;
          return SDLT;
        } else {
          SDLT = 0;
          return SDLT;
        }
    }


    function MonthlyPayment( loanAmount,  MortgageTerm,  interestRate) {
      var termInMonths = MortgageTerm * 12;
      if(interestRate == 0) { //if 0 monthly payment = principle payment
          var monthlyPayment = loanAmount/termInMonths; //240 months 
          return monthlyPayment;
      } else {
          interestRate /= 100; // Convert interest rate into a decimal
           var monthlyRate = interestRate / 12;
           var monthlyPayment = (loanAmount*monthlyRate) / (1-Math.pow(1+monthlyRate, -termInMonths));
           return monthlyPayment;
      }
  }
  
  function InterestPayment( loanAmount,  MortgageTerm,  interestRate) {
      var MonthlyPaymentVar = MonthlyPayment(loanAmount, MortgageTerm, interestRate);
      var PrincipalPayment = MonthlyPayment(loanAmount, MortgageTerm, 0);

      var InterestPayment = MonthlyPaymentVar - PrincipalPayment;

      return InterestPayment;
  }
  
  function calcROI(initialInvestment, currentValue){
    var ROI = ((currentValue-initialInvestment)/initialInvestment)*100;
    return ROI;
  }

  function futureValue(mv, hpi, year){
    var futureMV = mv;
    hpi /= 100;
    if(year <= 0){ //year is 0 no capital growth taken place
        return futureMV;
    } else {
        for (var i=1; i<=year; i++){
          futureMV = futureMV + (futureMV*hpi);
            }
        return futureMV;
    }
  }

  function pushGraphData(EquityData, equity, mvData, FutureMV, NetCashflowData, netCashflow){
      EquityData.push(equity.toFixed(2));
      mvData.push(FutureMV.toFixed(2));
      NetCashflowData.push(netCashflow.toFixed(2));

  }