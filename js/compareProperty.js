function compareProperty(){

    alert("Please select the first property to compare");
    $("#property_list li").click(function(event) {
      event.preventDefault();
      var id1 = this.id;
      
      alert(properties[id1].address + " selected, Please select the second property to compare");
      $("#property_list li").unbind('click').click(function(event) {
      event.preventDefault();
      var id2 = this.id;
      
      localStorage.lastProp1Compared= id1;
      localStorage.lastProp2Compared = id2;

      compareProperty2(id1, id2);

      var propObj = {};
      propObj = properties[id1]; 
      $.mobile.pageContainer.pagecontainer("change","#property_compare_screen",{property:propObj, transition:"slide"}) //change to comparer screen
  });
});

}

function compareProperty2(i, j){

  var taxRateDecimal = taxRate / 100;
  var taxFree = (1-taxRateDecimal);
  var investmentReturn = 0;
  var investmentReturn2 = 0;
  var totalCashReturn = 0;
  var totalCashReturn2 = 0;
  legalFees = legalFees*1;

  var annualRent = properties[i].annualRent;
  var annualRent2 = properties[j].annualRent;

  var HPI = properties[i].hpi;
  var HPI2 = properties[j].hpi;

  var rentReview = properties[i].rentReview;
  var rentReview2 = properties[j].rentReview;

  var rentReviewPeriod = properties[i].rentReviewPeriod;
  var rentReviewPeriod2 = properties[j].rentReviewPeriod;

  var mv = properties[i].marketvalue*1; //needs to be *1 for toFixed() to work, no idea why
  var mv2 = properties[j].marketvalue*1;  

  var FutureMV = mv;
  var FutureMV2 = mv2;

  var loanAmount = mv * ((100-LTV)/100);
  var loanAmount2 = mv2 * ((100-LTV)/100);  

  var SDLT = StampDuty(mv);
  var SDLT2 = StampDuty(mv);


  var equityPayment = MonthlyPayment(loanAmount, mortgageTerm, 0);
  var equityPayment2 = MonthlyPayment(loanAmount2, mortgageTerm, 0);

  var interestPayment = InterestPayment(loanAmount, mortgageTerm, interestRate);
  var interestPayment2 = InterestPayment(loanAmount2, mortgageTerm, interestRate);

  var deposit = mv-(mv * ((100-LTV)/100));
  var deposit2 = mv2-(mv2 * ((100-LTV)/100));

  var equity =  deposit;
  var equity2 =  deposit2;

  var equityTax = equityPayment*taxRateDecimal;
  var equityTax2 = equityPayment2*taxRateDecimal;

  var mortgageOutgoings = ((equityPayment + equityTax) + interestPayment)*12;
  var mortgageOutgoings2 = ((equityPayment2 + equityTax2) + interestPayment2)*12;

  var initialInvestment = (deposit + SDLT + legalFees);
  var initialInvestment2 = (deposit2 + SDLT2 + legalFees);

  var upfrontCosts = SDLT + legalFees
  var upfrontCosts2 = SDLT2 + legalFees

  var netCashflow = ((annualRent - mortgageOutgoings)*taxFree)-upfrontCosts;
  var netCashflow2= ((annualRent2 - mortgageOutgoings2)*taxFree)-upfrontCosts2;

  var tableRows = (mortgageTerm * 1)+5; //table will be length of mortgage plus 5 years into the future





  $("#property_compare_content").empty(); //Clears all nodes in the property_breakdown div, otherwise would keep adding content each time clicked

   $("#propertycompareh3").html(properties[i].address + " & " + properties[j].address) ; //changes header text
         
   $("#property_compare_content").append( '<h2>' + properties[i].address + ' vs ' + properties[j].address+'</h2><br><canvas id="compareChart" width="400" height="400"></canvas><p>The comparison below uses a Loan to Value of '+LTV+'% with a Mortgage Term of '+mortgageTerm+' Years and interest rate of '+interestRate+'%.</p>'+
  
   '<br><table class="table-stripe"><thead><tr><th style="width: 85%"></th><th style="width: 15%">' + properties[i].address + '</th><th style="width: 15%">' + properties[j].address+'</th></tr></thead><tbody>'+
       '<tr><td>Market Value:</td><td>'+'£'+mv+'</td><td>'+'£'+mv2+'</td></tr>'+
       '<tr><td>Expected Annual Rent:</td><td>'+'£'+properties[i].annualRent+'</td><td>'+'£'+properties[j].annualRent+'</td></tr>'+
       '<tr><td>Yield:</td><td>'+properties[i].yield.toFixed(2)+'%'+'</td><td>'+properties[j].yield.toFixed(2)+'%'+'</td></tr>'+
       '<tr><td>Price per SqFt:</td><td>'+'£'+properties[i].ppsqft.toFixed(2)+'</td><td>'+'£'+properties[j].ppsqft.toFixed(2)+'</td></tr>'+
       '<tr><td>SDLT:</td><td>'+'£'+SDLT.toFixed(2)+'</td><td>'+'£'+SDLT2.toFixed(2)+'</td></tr>'+
       '<tr><td>Amount to borrow:</td><td>'+'£'+loanAmount.toFixed(2)+'</td><td>'+'£'+loanAmount2.toFixed(2)+'</td></tr>'+
       '<tr><td>Monthly Payment:</td><td>'+'£'+MonthlyPayment(loanAmount, mortgageTerm, interestRate).toFixed(2)+'</td><td>'+'£'+MonthlyPayment(loanAmount2, mortgageTerm, interestRate).toFixed(2)+'</td></tr>'+
       '<tr><td>Principle:</td><td>'+'£'+MonthlyPayment(loanAmount, mortgageTerm, 0).toFixed(2)+'</td><td>'+'£'+MonthlyPayment(loanAmount2, mortgageTerm, 0).toFixed(2)+'</td></tr>'+
       '<tr><td>Interest Payment:</td><td>'+'£'+InterestPayment(loanAmount, mortgageTerm, interestRate).toFixed(2)+'</td><td>'+'£'+InterestPayment(loanAmount2, mortgageTerm, interestRate).toFixed(2)+'</td></tr>'+
   '</tbody></table>');//End of first summary table






   var ctx = document.getElementById('compareChart').getContext('2d');
   var EquityData = [];
   var EquityData2 = [];
   var NetCashflowData = [];
   var NetCashflowData2 = [];
   var mvData = [];
   var mvData2 = [];
   var ROIData = [];
   var ROIData2 = [];
   var ROIPercentData = [];
   var ROIPercentData2 = [];
   
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
              label: 'Equity 2',
              yAxisID: 'A',
              data: []  = EquityData2,
              borderColor: "#C16A32",
              fill: false,
              lineTension: 0,
              pointRadius: 0,
            },   
             {
                 label: 'Net Cashflow',
                 yAxisID: 'A',
                 data: [] = NetCashflowData,
                 borderColor: "#CCA300",
                 fill: false,
                 lineTension: 0,
                 pointRadius: 0,
             },
             {
              label: 'Net Cashflow 2',
              yAxisID: 'A',
              data: [] = NetCashflowData2,
              borderColor: "#335CFF",
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
           {
            label: 'Market Value 2',
            yAxisID: 'A',
            data: [] = mvData2,
            borderColor: "#3BA7AF",
            fill: false,
            lineTension: 0,
            pointRadius: 0,
        },
             {
               label: 'ROI %',
               yAxisID: 'B',
               data: [] = ROIPercentData,
               borderColor: "#3cba9f",
               fill: false,
               lineTension: 0,
               pointRadius: 0,
           },
           {
            label: 'ROI % 2',
            yAxisID: 'B',
            data: [] = ROIPercentData2,
            borderColor: "#C34560",
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
                     gridLines: {
                      color: graphGridColor
                     },
                     ticks: {
                         beginAtZero: true,
                         fontColor: graphFontColor
                         
                     }
                   },{
                     id: 'B',
                     type: 'linear',
                     position: 'right',
                     gridLines: {
                       color: graphGridColor
                      },
                     ticks: {
                       beginAtZero: true,
                       fontColor: graphFontColor
                   }
                 }],
                 xAxes: [{
                   ticks: {
                     fontColor: graphFontColor
                   },
                   gridLines: {
                     color: graphGridColor
                    }
                 }],
             }
             
         }
     });
     
   
   $("#property_breakdown").append('<br><table class="table-stripe" id="tableSummary"><thead><tr><th style="width: 13%">Year</th><th style="width: 29%">Equity</th><th style="width: 29%">Net Cashflow</th><th style="width: 29%">ROI</th></tr></thead><tbody>');//table head
   //FOR loop generating table contents
   for(var j = 0; j<=tableRows; j++){
   
   chart.data.labels.push("Yr "+j); //push x axis on chart
   FutureMV = futureValue(mv, HPI, j);
   CapitalGrowth = FutureMV - futureValue(mv, HPI, j-1);
   totalCashReturn = totalCashReturn + netCashflow;
   FutureMV2 = futureValue(mv2, HPI2, j);
   CapitalGrowth2 = FutureMV2 - futureValue(mv2, HPI2, j-1);
   totalCashReturn2 = totalCashReturn2 + netCashflow2;
   
   if((j+1) % rentReviewPeriod == 0 && j != 0){
     annualRent=(annualRent+(annualRent*(rentReview/100))); 
   }
   if((j+1) % rentReviewPeriod2 == 0 && j != 0){
    annualRent2=(annualRent2+(annualRent2*(rentReview2/100))); 
  }
   
   if (j == 0){
                             
                             investmentReturn = equity + totalCashReturn;
                             investmentReturn2 = equity2 + totalCashReturn2;
                             pushGraphData(EquityData, equity, mvData, FutureMV, NetCashflowData, netCashflow);
                             pushGraphData(EquityData2, equity2, mvData2, FutureMV2, NetCashflowData2, netCashflow2);
                             $("#tableSummary").append('<tr><td>'+j+'</td><td>£'+equity.toFixed(2)+'</td><td>£'+netCashflow.toFixed(2)+'</td><td>'+calcROI(initialInvestment, investmentReturn).toFixed(2)+'%</td></tr>');
                             netCashflow = (annualRent - mortgageOutgoings)*taxFree;
                             netCashflow2 = (annualRent2 - mortgageOutgoings2)*taxFree;
         
    } else if (j < (mortgageTerm*1-1)){
     
                             equity = equity + (equityPayment*12) + CapitalGrowth;
                             equity2 = equity2 + (equityPayment2*12) + CapitalGrowth2;
                             investmentReturn = equity + totalCashReturn;
                             investmentReturn2 = equity2 + totalCashReturn2;
                             pushGraphData(EquityData, equity, mvData, FutureMV, NetCashflowData, netCashflow);
                             pushGraphData(EquityData2, equity2, mvData2, FutureMV2, NetCashflowData2, netCashflow2);
                             $("#tableSummary").append('<tr><td>'+j+'</td><td>£'+equity.toFixed(2)+'</td><td>£'+netCashflow.toFixed(2)+'</td><td>'+calcROI(initialInvestment, investmentReturn).toFixed(2)+'%</td></tr>');
                             netCashflow = (annualRent - mortgageOutgoings)*taxFree;
                             netCashflow2 = (annualRent2 - mortgageOutgoings2)*taxFree;
         
     } else if (j == (mortgageTerm*1-1) || j == mortgageTerm){
         
                             equity = equity + (equityPayment*12) + CapitalGrowth;
                             equity2 = equity2 + (equityPayment2*12) + CapitalGrowth2;
                             investmentReturn = equity + totalCashReturn;
                             investmentReturn2 = equity2 + totalCashReturn2;
                             pushGraphData(EquityData, equity, mvData, FutureMV, NetCashflowData, netCashflow)
                             pushGraphData(EquityData2, equity2, mvData2, FutureMV2, NetCashflowData2, netCashflow2);
                             $("#tableSummary").append('<tr><td>'+j+'</td><td>£'+equity.toFixed(2)+'</td><td>£'+netCashflow.toFixed(2)+'</td><td>'+calcROI(initialInvestment, investmentReturn).toFixed(2)+'%</td></tr>');
                             netCashflow = annualRent*taxFree;
                             netCashflow2 = annualRent2*taxFree;
   
     } else if (j <= tableRows){
                             equity = equity + CapitalGrowth;
                             equity2 = equity2 + CapitalGrowth2;
                             investmentReturn = equity + totalCashReturn;
                             investmentReturn2 = equity2 + totalCashReturn2;
                             pushGraphData(EquityData, equity, mvData, FutureMV, NetCashflowData, netCashflow)
                             pushGraphData(EquityData2, equity2, mvData2, FutureMV2, NetCashflowData2, netCashflow2);
                             $("#tableSummary").append('<tr><td>'+j+'</td><td>£'+equity.toFixed(2)+'</td><td>£'+netCashflow.toFixed(2)+'</td><td>'+calcROI(initialInvestment, investmentReturn).toFixed(2)+'%</td></tr>');     
                             netCashflow = annualRent*taxFree;
                             netCashflow2 = annualRent2*taxFree;  
     }
     
     
     
   
     ROIData.push(investmentReturn).toFixed(2);
     ROIData2.push(investmentReturn2).toFixed(2);
     ROIPercentData.push(calcROI(initialInvestment, investmentReturn).toFixed(2));
     ROIPercentData2.push(calcROI(initialInvestment2, investmentReturn2).toFixed(2));
     
    
   }
   
   $("#tableSummary").append('</tbody></table>');
      

}


function genPopup(header, text){}
