<?php
header("refresh: 1800;");
?>
<!doctype html >
<html lang="en" >
<head>
<title> Live Charts </title>
<meta charset="utf-8" >
<link href="css/style.css" rel="stylesheet" type="text/css" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" > </script>
<!-- Load the AJAX API -->
<script type="text/javascript" src="https://www.google.com/jsapi" > </script>
<script type="text/javascript" >

    /* Get data from the database */
    function getData() {
        jQuery.ajax({
            url: 'ajaxpres.php',
            type: 'GET',
            dataType: 'json',
            mimeType: 'multipart/form-data',
            contentType: false,
            cache: false,
            processData: false,
            success: function( data, jqXHR ) {
                if( data == "null" ) {
                    // just in case
                } else {
                    drawGraph( data );
                }
            },
            error: function( textStatus ) {
                console.log(" error. damm. ");
            }
        });
    }
    
    /* Initialization of Google Charts API */
    google.load( "visualization" , "1", { packages: [ "corechart" ] });
    google.setOnLoadCallback( getData );
    
    /* Chart to render time-user graphs */
    function drawGraph( data ) {
        for( var i = data.length; i > 0; i-- ) {
            data[i] = data[i - 1];
        }
        data[0] = [ 'date', 'presure' ];
        console.log( data );
        var chartData = google.visualization.arrayToDataTable( data );

        var options = {
            title: ' Time - Presure '
        };

        var chart = new google.visualization.LineChart( document.getElementById( 'chart_div' ) );

        chart.draw( chartData , options );
    }
	
</script>
</head>
<body>
    <div class="container" >
        <h3> Line Chart Presure 72 hours</h3>
        
        <!-- Div that will hold the line chart -->
        <div id="chart_div" > </div>

		<center><iframe width="200" height="200" src="preschart.php" frameborder="0" scrolling="no"/></center>
		
    </div>
</body>
</html>