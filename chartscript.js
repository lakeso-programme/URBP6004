


function createChart1(){
//$(document).ready(function(){
// Load csv and create a CSV_to_JSON function to convert the csv into the following format:
// data: [{
//     x: 10,
//     y: 20
// }, {
//     x: 15,
//     y: 10
// }]
    var title = 'Compare Travel Distance and Commute Flow Volume in UK';
    
    var pointx = 'distance';
    var pointx_prefix = '';
    var pointx_postfix = 'm';

    var pointy = 'flow';
    var pointy_prefix = '';
    var pointy_postfix = '';


    var pointz = 'popden';


    var x_axis = 'Travel Distance in metres';
    var y_axis = 'Commuting flow';
    var point_color = '#6699FF';
  
    var point_radius = 5;
    

    var show_grid = true;

    //read csv
    $.get('distance_n_flow2.csv', function(csvString) {
        var rows = Papa.parse(csvString, {header: true}).data;

        var data = rows.map(function(row) {
            return {
                x: row[pointx],
                y: row[pointy],
                name: row[pointz]  
            }
        })

    
    var scatterdata = {
        datasets: [{
            label: 'Distance-Flow Volumn Point',
            borderColor: '#333399',
            backgroundColor : point_color,
            data: data,
            pointRadius: point_radius,
            pointHoverRadius: Math.pow(point_radius, 2)
            }]
        
    };    
    
   
    const ctx = document.getElementById('mycanvas1').getContext('2d');
    Chart.Scatter(ctx, {
        data: scatterdata,
            options: {
                title: {
                    display: true,
                    text: title,
                    fontSize: 14,
                    },
                scales: {
                    xAxes:[{
                        scaleLabel:{
                            display: true,
                            labelString: x_axis,
                        },
                        position: 'bottom',
                        ticks: {
                            callback: function(value, index, values) {
                                return pointx_prefix + value.toLocaleString() + pointx_postfix;
                                }
                            }
                        
                    }],
                    yAxes: [{
                        type: 'logarithmic',
                        ticks: {
                            callback: function(tick) {
                                var remain = tick / (Math.pow(10, Math.floor(Chart.helpers.log10(tick))));
                                if (remain === 1 || remain === 2 || remain === 5) {
                                    return tick.toString();
                                }
                                return '';
                            }
                        },
                    scaleLabel: {
                        labelString: y_axis,
                        display: true,
                    },
                    gridLines: {
                        display: show_grid,
                    }
                    }]
                },
                tooltips:{
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItem, all){
                            return [
                                'Pop Density : '+all.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].name,
                            ]
                        },
                        label: function(tooltipItem, all) {
                            return [
                                x_axis + ': ' + pointx_prefix + tooltipItem.xLabel.toLocaleString() + pointx_postfix,
                                y_axis + ': ' + pointy_prefix + tooltipItem.yLabel.toLocaleString() + pointy_postfix
                            ]
                        }
                    }
                },
            }
            
    });
                
    });       
  
    
    

    
}


        

                

  

    
    




            




