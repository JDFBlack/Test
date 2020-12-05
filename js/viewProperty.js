function viewProperty(i){
          
  localStorage.lastPropertyPageViewed = i;

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
  var taxFree = (1-taxRateDecimal); //Default 0.81
  var investmentReturn = 0;
  var totalCashReturn = 0;
  legalFees = legalFees*1;
  

  var initialInvestment = (deposit + SDLT + legalFees);
  var upfrontCosts = SDLT + legalFees;

  var outgoings = properties[i].expenses;

  var netCashflow = ((annualRent - mortgageOutgoings - outgoings)*taxFree)-upfrontCosts;
  var taxPayable = ((annualRent - mortgageOutgoings - outgoings)*taxRateDecimal)+equityTax;
  var netCashflowPieChart = ((annualRent - mortgageOutgoings)*taxFree);

  var tableRows = (mortgageTerm * 1)+5; //table will be length of mortgage plus 5 years into the future
  

$("#property_breakdown").empty(); //Clears all nodes in the property_breakdown div, otherwise would keep adding content each time clicked
$("#property_breakdown_footer").empty();

$("#propertybreakdownh3").html(properties[i].address); //changes header text
      
$("#property_breakdown").append( '<h2>' + properties[i].address + '</h2><p>Upfront Capital Required: £'+initialInvestment+'</p><p>The summary below uses a Loan to Value of '+LTV+'% with a Mortgage Term of '+mortgageTerm+' Years and interest rate of '+interestRate+'%.</p>'+
'<br><table class="table-stripe"><thead><tr><th style="width: 85%"></th><th style="width: 15%"></th></tr></thead><tbody>'+
    '<tr><td>Market Value:</td><td>'+'£'+mv+'</td></tr>'+
    '<tr><td>Expected Annual Rent:</td><td>'+'£'+properties[i].annualRent+'</td></tr>'+
    '<tr><td>Yield:</td><td>'+properties[i].yield.toFixed(2)+'%'+'</td></tr>'+
    '<tr><td>Price per SqFt:</td><td>'+'£'+properties[i].ppsqft.toFixed(2)+'</td></tr>'+
    '<tr><td>SDLT:</td><td>'+'£'+SDLT.toFixed(2)+'</td></tr>'+
    '<tr><td>Amount to borrow:</td><td>'+'£'+loanAmount.toFixed(2)+'</td></tr>'+
    '<tr><td>Monthly Payment:</td><td>'+'£'+MonthlyPayment(loanAmount, mortgageTerm, interestRate).toFixed(2)+'</td></tr>'+
    '<tr><td>Principle:</td><td>'+'£'+MonthlyPayment(loanAmount, mortgageTerm, 0).toFixed(2)+'</td></tr>'+
    '<tr><td>Monthly Outgoings:</td><td>'+'£'+outgoings+'</td></tr>'+
'</tbody></table>'+//End of first summary table

'<br><div class="ui-grid-a ui-responsive">'+//UI-responsive shows graph/ piechart side by side on ipads+, and above/ below on iphone.
'<div class="ui-block-a"><canvas id="breakdownChart" width="400" height="400"></canvas></div>'+//GRAPH
'<div class="ui-block-b"><canvas id="pieChart" width="400" height="400"></canvas></div></div>'+//PIE CHART

'<p>Net Cashflow is calculated using a tax rate of '+taxRate+'%</p>');//Text after graph

/*var thumbnail;
  if(properties[i].thumbnail == null){
    thumbnail = "img/defaultHouse.jpg";
  } else {
    thumbnail = properties[i].thumbnail
  }
  $('#breakdownThumbnail').attr("src", thumbnail);*/
    
var ctx = document.getElementById('breakdownChart').getContext('2d');
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
              borderColor: "#CCA300",
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

  var ctx2 = document.getElementById('pieChart').getContext('2d');
  if(netCashflowPieChart <= 0){netCashflowPieChart=0;}
  var chart2 = new Chart(ctx2, {
      type: 'doughnut',

      data: {
          labels: ['Profit (After Tax)', 'Equity Payments', 'Interest Payments', 'Tax', "Other Expenses"],
          datasets: [{
              label: 'My First dataset',
              backgroundColor: ['#3cba9f','#3cba9f','#c45850','#c45850','#c45850'],
              borderColor: graphGridColor,
              data: [netCashflowPieChart.toFixed(2), equityPayment.toFixed(2), interestPayment.toFixed(2), taxPayable.toFixed(2), outgoings]
              
          }]
      },

      options: {
        legend: {
          labels: {
              fontColor: graphFontColor
          }
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