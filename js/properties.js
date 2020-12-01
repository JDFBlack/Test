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
            
            $("#property_list").append('<li><a href="javascript:viewPropertyFromHomeScreen('+i+')">' + 
              '<img src="'+properties[i].thumbnail+'"><h2>' + properties[i].address + 
              '</h2><p>Market Value: £' + properties[i].marketvalue + 
              '</p><p>Annual Rent: £' + properties[i].annualRent + '  Yield: ' + properties[i].yield.toFixed(2) + 
              '% </p><p>Price per SqFt: £' + properties[i].ppsqft.toFixed(2) + 
            '</p></a><a href="javascript:addEditDeleteProperty('+i+')">Edit</a></li>'); //appends, also gives edit delete function value i
          }
          $("#property_list").listview("refresh"); //refreshes element, otherwise won't display as a list view
        }
      }

      function viewProperty(i){
          
          localStorage.lastPropertyPageViewed = i;
          var propObj = {};
          propObj = properties[i];

          var annualRent = properties[i].annualRent;
          var HPI = properties[i].hpi;
          var rentReview = properties[i].rentReview; //Needs changed
          var rentReviewPeriod = properties[i].rentReviewPeriod;
          var mv = properties[i].marketvalue*1; //needs to be *1 for toFixed() to work, no idea why 
          var FutureMV = mv;
          var loanAmount = mv * ((100-LTV)/100);     
          var taxRateDecimal = taxRate / 100;
          var SDLT = StampDuty(mv);
 

          var equityPayment = MonthlyPayment(loanAmount, mortgageTerm, 0);
          var interestPayment = InterestPayment(loanAmount, mortgageTerm, interestRate);

          var deposit = mv-(mv * ((100-LTV)/100));
          var equity =  deposit;

          var equityTax = equityPayment*taxRateDecimal;
          var mortgageOutgoings = ((equityPayment + equityTax) + interestPayment)*12;
          var taxFree = (1-taxRateDecimal);
          var investmentReturn = 0;
          var totalCashReturn = 0;
          legalFees = legalFees*1;
          

          var initialInvestment = (deposit + SDLT + legalFees);
          var upfrontCosts = SDLT + legalFees

          var netCashflow = ((annualRent - mortgageOutgoings)*taxFree)-upfrontCosts;

          var tableRows = (mortgageTerm * 1)+5; //table will be length of mortgage plus 5 years into the future
          

       $("#property_breakdown").empty(); //Clears all nodes in the property_breakdown div, otherwise would keep adding content each time clicked
       $("#property_breakdown_footer").empty();

        $("#propertybreakdownh3").html(properties[i].address); //changes header text
              
        $("#property_breakdown").append( '<h2>' + properties[i].address + '</h2><p>Upfront Capital Required: £'+initialInvestment+'</p><p>The summary below uses a Loan to Value of '+LTV+'% with a Mortgage Term of '+mortgageTerm+' Years and interest rate of '+interestRate+'%.</p>'+
        '<br><table class="table-stripe"><thead><tr><th style="width: 85%"></th><th style="width: 15%"></th></tr></thead><tbody><tr>'+
        '<td>Market Value:</td><td>'+'£'+mv+
        '</td></tr><tr><td>Expected Annual Rent:</td><td>'+'£'+properties[i].annualRent+
        '</td></tr><tr><td>Yield:</td><td>'+properties[i].yield.toFixed(2)+'%'+
        '</td></tr></tr><tr><td>Price per SqFt:</td><td>'+'£'+properties[i].ppsqft.toFixed(2)+
        '</td></tr></tr><tr><td>SDLT:</td><td>'+'£'+SDLT.toFixed(2)+
        '</td></tr></tr><tr><td>Amount to borrow:</td><td>'+'£'+loanAmount.toFixed(2)+
        '</td></tr></tr><tr><td>Monthly Payment:</td><td>'+'£'+MonthlyPayment(loanAmount, mortgageTerm, interestRate).toFixed(2)+
        '</td></tr></tr><tr><td>Principle:</td><td>'+'£'+MonthlyPayment(loanAmount, mortgageTerm, 0).toFixed(2)+
        '</td></tr></tr><tr><td>Interest Payment:</td><td>'+'£'+InterestPayment(loanAmount, mortgageTerm, interestRate).toFixed(2)+
        '</td></tr><tbody><table><br><canvas id="myChart" width="400" height="400"></canvas><p>Net Cashflow is calculated using a tax rate of '+taxRate+'%</p>'); //End of first summary table
        
        /*var thumbnail;
          if(properties[i].thumbnail == null){
            thumbnail = "img/defaultHouse.jpg";
          } else {
            thumbnail = properties[i].thumbnail
          }
          $('#breakdownThumbnail').attr("src", thumbnail);*/
            
        var ctx = document.getElementById('myChart').getContext('2d');
        var EquityData = [];
        var NetCashflowData = [];
        var mvData = [];
        var ROIData = [];
        var ROIPercentData = [];

            var chart = new Chart(ctx, {
              type: 'line',
              data: {
                  labels: [],//For loop pushes j here. Labels is years
                  datasets: [{
                      label: 'Equity',
                      yAxisID: 'A',
                      data: []  = EquityData,
                      borderColor: "#3e95cd",
                      fill: false,
                      lineTension: 0,
                      pointRadius: 0,
                  },
                  {
                      label: 'Net Cashflow',
                      yAxisID: 'A',
                      data: [] = NetCashflowData,
                      borderColor: "#e8c3b9",
                      fill: false,
                      lineTension: 0,
                      pointRadius: 0,
                  },
                  {
                    label: 'Market Value',
                    yAxisID: 'A',
                    data: [] = mvData,
                    borderColor: "#c45850",
                    fill: false,
                    lineTension: 0,
                    pointRadius: 0,
                },
                  /*{
                    label: 'ROI',
                    yAxisID: 'A',
                    data: [] = ROIData,
                    borderColor: "#8e5ea2",
                    fill: false,
                    lineTension: 0,
                    pointRadius: 0,
                },*/
                  {
                    label: 'ROI %',
                    yAxisID: 'B',
                    data: [] = ROIPercentData,
                    borderColor: "#3cba9f",
                    fill: false,
                    lineTension: 0,
                    pointRadius: 0,
                }],
              },
                options: {
                  legend: {
                    labels: {
                        fontColor: graphFontColor,
                    }
                  },
                
                    scales: {
                        yAxes: [{
                            id: 'A',
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                beginAtZero: true,
                                fontColor: graphFontColor
                                
                            }
                          },{
                            id: 'B',
                            type: 'linear',
                            position: 'right',
                            ticks: {
                              beginAtZero: true,
                              fontColor: graphFontColor
                          }
                        }],
                        xAxes: [{
                          ticks: {
                            fontColor: graphFontColor
                          }
                        }]
                    }
                    
                }
            });
          

        $("#property_breakdown").append('<br><table class="table-stripe" id="tableSummary"><thead><tr><th style="width: 13%">Year</th><th style="width: 29%">Equity</th><th style="width: 29%">Net Cashflow</th><th style="width: 29%">ROI</th></tr></thead><tbody>');//table head
        
        //FOR loop generating table contents
        var mortgageTermPlusOne = (mortgageTerm*1)+1;
        for(var j = 0; j<=tableRows; j++){
        
        chart.data.labels.push("Yr "+j); //push x axis on chart
        FutureMV = futureValue(mv, HPI, j);
        CapitalGrowth = FutureMV - futureValue(mv, HPI, j-1);
        totalCashReturn = totalCashReturn + netCashflow;
        
        if((j+1) % rentReviewPeriod == 0 && j != 0){
          annualRent=(annualRent+(annualRent*(rentReview/100))); //annual rent increases 5% PA;
        }

        if (j == 0){
                                  
                                  investmentReturn = equity + totalCashReturn;
                                  pushGraphData(EquityData, equity, mvData, FutureMV, NetCashflowData, netCashflow);
                                  $("#tableSummary").append('<tr><td>'+j+'</td><td>£'+equity.toFixed(2)+'</td><td>£'+netCashflow.toFixed(2)+'</td><td>'+calcROI(initialInvestment, investmentReturn).toFixed(2)+'%</td></tr>');
                                  netCashflow = (annualRent - mortgageOutgoings)*taxFree;
              
         } else if (j < (mortgageTerm*1-1)){
          
                                  equity = equity + (equityPayment*12) + CapitalGrowth;
                                  investmentReturn = equity + totalCashReturn;
                                  pushGraphData(EquityData, equity, mvData, FutureMV, NetCashflowData, netCashflow);
                                  $("#tableSummary").append('<tr><td>'+j+'</td><td>£'+equity.toFixed(2)+'</td><td>£'+netCashflow.toFixed(2)+'</td><td>'+calcROI(initialInvestment, investmentReturn).toFixed(2)+'%</td></tr>');
                                  netCashflow = (annualRent - mortgageOutgoings)*taxFree;
              
          } else if (j == (mortgageTerm*1-1) || j == mortgageTerm){
              
                                  equity = equity + (equityPayment*12) + CapitalGrowth;
                                  investmentReturn = equity + totalCashReturn;
                                  pushGraphData(EquityData, equity, mvData, FutureMV, NetCashflowData, netCashflow)
                                  $("#tableSummary").append('<tr><td>'+j+'</td><td>£'+equity.toFixed(2)+'</td><td>£'+netCashflow.toFixed(2)+'</td><td>'+calcROI(initialInvestment, investmentReturn).toFixed(2)+'%</td></tr>');
                                  netCashflow = annualRent*taxFree;

          } else if (j <= tableRows){
                                  equity = equity + CapitalGrowth;
                                  investmentReturn = equity + totalCashReturn;
                                  pushGraphData(EquityData, equity, mvData, FutureMV, NetCashflowData, netCashflow)
                                  $("#tableSummary").append('<tr><td>'+j+'</td><td>£'+equity.toFixed(2)+'</td><td>£'+netCashflow.toFixed(2)+'</td><td>'+calcROI(initialInvestment, investmentReturn).toFixed(2)+'%</td></tr>');     
                                  netCashflow = annualRent*taxFree; 
          }
          
          
          

          ROIData.push(investmentReturn).toFixed(2);
          ROIPercentData.push(calcROI(initialInvestment, investmentReturn).toFixed(2));
          
         
        }

        
        
        $("#tableSummary").append('</tbody></table>');

        $("#property_breakdown_footer").append('<a href="javascript:directionsProperty('+i+')" data-icon="location" class="ui-link ui-btn ui-icon-location ui-btn-icon-top">Directions</a>');  //no idea why this class fixes bug but it does
        
         
    }

    function viewPropertyFromHomeScreen(i){
      var propObj = {};
      propObj = properties[i];
      viewProperty(i);
      $.mobile.pageContainer.pagecontainer("change","#property_screen",{property:propObj, transition:"slide"}) //change to property screen
    }
      
    
    function directionsProperty(i){
          var propObj = {};
          var origin = "BT476BE";
          //var origin = geolocate();
          console.log(origin);
          var destination = properties[i].postcode;
          propObj = properties[i];

          //$("#directionsMap").empty();
        $("#property_directions_content").empty(); //Clears all nodes in the property_breakdown div, otherwise would keep adding content each time clicked
 
        $("#propertydirectionsh3").html(properties[i].address); //changes header text

        $("#property_directions_content").append('<div id="embedmap-display"><iframe style="height:75vh;width:100%;border:0;" frameborder="0" src="https://www.google.com/maps/embed/v1/directions?origin='+origin+'&destination='+destination+'&zoom=12&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"></iframe></div>');
        $.mobile.pageContainer.pagecontainer("change","#property_directions",{property:propObj, transition:"slide"})
    }

    function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
          });
          autocomplete.setBounds(circle.getBounds());
        });
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
