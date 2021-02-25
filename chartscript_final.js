


function createChart2(){
    
//$(document).ready(function(){
    // Load csv and create a CSV_to_JSON function to convert the csv into the following format:
    // data: [{
    //     x: 10,
    //     y: 20
    // }, {
    //     x: 15,
    //     y: 10
    // }]
    var title = 'Compare Travel Distance and Commute Flow Volume in UK - Prediction and Actual Flow';
    
    var pointx1 = 'distance';
    var pointx1_prefix = '';
    var pointx1_postfix = 'm';

    var pointy1 = 'All';
    var pointy2 = 'pred_flow';

    var pointz = 'res_pop'
    var x_axis = 'Travel Distance in metres';
    var y_axis = 'Commuting flow';
    var point_color1 = '#A52A2A';
    var point_color2 = '#7FFFD4';
    var point_radius = 5;
    

    var show_grid = true;

    //read csv
    $.get('prediction.csv', function(csvString) {
        var rows = Papa.parse(csvString, {header: true}).data;

        var data1 = rows.map(function(row) {
            return {
                x: row[pointx1],
                y: row[pointy1],
                z: row[pointz] 
            }
        });


        var data2 = rows.map(function(row) {
            return {
                x: row[pointx1],
                y: row[pointy2],
                z: row[pointz] 
            }
        });
        
        

        var scatterdata = {
            datasets: [{
                label: 'Actual Flow',
                backgroundColor : point_color1,
                data: data1,
                pointRadius: point_radius,
                pointHoverRadius: Math.pow(point_radius, 2)
                },{
                label: 'Predicted Flow',
                backgroundColor : point_color2,
                data: data2,
                pointRadius: point_radius,
                pointHoverRadius: Math.pow(point_radius, 2)
                }]  
        };    
    
   
        const ctx = document.getElementById('mycanvas2').getContext('2d');
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
                                return pointx1_prefix + value.toLocaleString() + pointx1_postfix;
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
                                'Residential Population : '+all.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].z,
                            ]
                        },
                        label: function(tooltipItem, all) {
                            return [
                                x_axis + ': ' + tooltipItem.xLabel.toLocaleString(),
                                y_axis + ': ' + tooltipItem.yLabel.toLocaleString()
                            ]
                        }
                    }
                },       
            }
                
        });
    });
   
             
}
                
          
  
    
    

    



        

                

  

    
    




            




