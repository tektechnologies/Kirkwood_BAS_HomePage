/* Globals Papa */



function filterByTeaching(districts){
  var selectYesNo = document.querySelector('#teachesCs');
  var selectedDistricts = [];
  if(selectYesNo.value === 'Yes'){
    for(var i=0; i<districts.length; i++){
      var district = districts[i];
      if(district['% Teaches CS']!== '0%'){
        selectedDistricts.push(district);
      }
    }
  } else if (selectYesNo.value === 'No'){
    for(var i=0; i<districts.length; i++){
      var district = districts[i];
      if(district['% Teaches CS']=== '0%'){
        selectedDistricts.push(district);
      }
    }
  } else {
    selectedDistricts = districts;
  }
  console.log(selectedDistricts);
  return selectedDistricts;

}

function filterByCounty(districts){
  var defineCounty = document.querySelector('#county');
  var selectedDistricts = districts;
  if(defineCounty.value){
    var selectedCounty = defineCounty.value.toUpperCase().trim();
    var filteredDistricts = [];
    for(var i=0; i<selectedDistricts.length; i++){
      var district = selectedDistricts[i];
      if(selectedDistricts[i]['Counties'].includes(selectedCounty)){
        filteredDistricts.push(district);
      }
    }
    selectedDistricts = filteredDistricts;
  }
  console.log(selectedDistricts);
  return selectedDistricts;
}

function filterBySchoolsInDist(districts){
  var defineInDist = document.querySelector('#inDist');
  var selectedDistricts = districts;
  if(defineInDist.value){
    var schoolNumber = defineInDist.value;
    var filteredDistricts = [];
    if(schoolNumber === '11+'){
      for(var i=0; i<selectedDistricts.length; i++){
        var district = selectedDistricts[i];
        if(Number(district['Schools in Dist'])>=11){
          filteredDistricts.push(district);
        }
      }
    } else if(schoolNumber === '6-10'){
      for(var i=0; i<selectedDistricts.length; i++){
        var district = selectedDistricts[i];
        if(6<=Number(district['Schools in Dist']) && Number(district['Schools in Dist'])<=10){
          filteredDistricts.push(district);
        }
      }
    } else{
      for(var i=0; i<selectedDistricts.length; i++){
        var district = selectedDistricts[i];
        if(district['Schools in Dist'] === schoolNumber){
          filteredDistricts.push(district);
        }
      }
    } selectedDistricts = filteredDistricts;
    return selectedDistricts;
  } else {
    return selectedDistricts;
  }
}

var dataBySchoolDistrict;
function loadData(){
  var csvUrl = 'data/DataBySchoolDistrict.csv';
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results){
      console.log('CSV loaded: ', results.data);
      dataBySchoolDistrict = results.data;
      renderAll();
    }
  });
}

function filterByData(){
  if(dataBySchoolDistrict){
    var filter1 = filterByTeaching(dataBySchoolDistrict);
    var filter2 = filterByCounty(filter1);
    var filter3 = filterBySchoolsInDist(filter2);
  }
  return filter3;
}

function renderAll() {
  var DistrictData = filterByData();
  var tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';


  for( var i = 0; i<DistrictData.length; i++) {
    var tr = document.createElement ('tr');
    var td1 = document.createElement ('td');
    td1.textContent = DistrictData[i]['School District Name'];
    tr.appendChild (td1);

    var td2 = document.createElement('td');
    td2.textContent = DistrictData[i]['% Teaches CS'];
    if(td2.textContent === '100%'){
      tr.classList.add('perfect');
    } else if(td2.textContent === '0%'){
      tr.classList.add('bad');
    }
    tr.appendChild(td2);

    var td3 = document.createElement('td');
    td3.textContent = DistrictData[i]['Schools in Dist'];
    tr.appendChild(td3);

    var td4 = document.createElement('td');
    td4.textContent = DistrictData[i]['District Student Population'];
    tr.appendChild(td4);

    var td5 = document.createElement('td');
    td5.textContent = DistrictData[i]['Responding %'];
    if(td5.textContent === '100%' && td2.textContent !== '0%'){
      tr.classList.add('semiPerfect');
    }else if(td5.textContent === '0%'){
      tr.classList.add('perfectlyBad');
    }
    tr.appendChild(td5);

    var td6 = document.createElement('td');
    td6.textContent = DistrictData[i]['Counties'];
    tr.appendChild(td6);

    tbody.appendChild(tr);
  }
  renderChart(DistrictData);
  saveAll();
  document.querySelector('form').scrollIntoView();
}

var scatterPlot;
function renderChart(filteredData){
  var canvas = document.querySelector('canvas');
  var labels = [];
  var perTeachesCs = [];
  var numOfSchools = [];
  var districtPops = [];
  var perResponded = [];
  var scatterData = [];
  for (var i = 0; i < filteredData.length; i++) {
    var teachesCsNum = Number(filteredData[i]['% Teaches CS'].slice(0, -1));
    var respondedNum = Number(filteredData[i]['Responding %'].slice(0, -1));
    labels[i] = filteredData[i]['School District Name'];
    perTeachesCs[i] = teachesCsNum;
    numOfSchools[i] = filteredData[i]['Schools in Dist'];
    districtPops[i] = filteredData[i]['District Student Population'];
    perResponded[i] = respondedNum;

    scatterData[i] = {
      x: numOfSchools[i],
      y: perTeachesCs[i]
    };
  }

  if(scatterPlot){
    scatterPlot.data.datasets[0].data = scatterData;
    scatterPlot.update();
    return;
  }

  var ctx = canvas.getContext('2d');

  scatterPlot = new Chart(ctx, {
    type: 'scatter',
    data: {
      labels: labels,
      datasets: [{
        label: 'Legend',
        backgroundColor: 'rgba(135, 13, 23, 0.273)',
        data: scatterData,
        radius: 6,
        borderColor: 'rgba(246,146,30)',
      }]
    },
    options: {
      legend: {
        display: false,
    },
      layout:{
        padding:{
          top: 50,
        }
      },
      tooltips:{
        callbacks: {
          label: function(tooltipItem, data){
            var label = data.labels[tooltipItem.index];
            return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
          }
        }
      },
      responsive: true,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number of Schools in District',
            fontSize: 15,
          },
          type: 'linear',
          position: 'bottom',
          ticks:{
            beginAtZero: true,
            min:0,
            max:70,
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '% Teaches Compute Science',
            fontSize:15,
          },
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 100,
          }
        }]

      },
      title: {
        display: true,
        lineHeight: 1,
        text: '',
        fontSize: 25,
        fontColor:'rgb(86,0,10)',


      }
    }
  });
}

function saveAll(){
  var currentTeaches = document.getElementById('teachesCs').value;
  var currentCounty = document.getElementById('county').value;
  var currentSchNum = document.getElementById('inDist').value;
  localStorage['currentTeaches'] = JSON.stringify(currentTeaches);
  localStorage['currentCounty'] = JSON.stringify(currentCounty);
  localStorage['currentSchNum'] = JSON.stringify(currentSchNum);
}

function loadFromStorage(){
  var jsonTeachesString = localStorage['currentTeaches'];
  var jsonCountyString = localStorage['currentCounty'];
  var jsonSchNumString = localStorage['currentSchNum'];

  if(jsonTeachesString){
    var teachesCs = JSON.parse(jsonTeachesString);
    document.getElementById('teachesCs').value = teachesCs;
  }
  if(jsonCountyString){
    var county = JSON.parse(jsonCountyString);
    document.getElementById('county').value = county;
  }
  if(jsonSchNumString){
    var schNum = JSON.parse(jsonSchNumString);
    document.getElementById('inDist').value = schNum;
  }
}

window.addEventListener('load', function onLoad(){
  loadData();
  loadFromStorage();
});
var selectors = document.querySelectorAll('.filter');
for(var i=0; i<selectors.length; i++){
  selectors[i].addEventListener('change', renderAll);
}
var selectorText = document.querySelector('.filterText');
selectorText.addEventListener('keyup', renderAll);
var resetButton = document.querySelector('button[type=reset]');
resetButton.addEventListener('click', function clearOnClick(){
  localStorage.clear();
  loadData();
});

