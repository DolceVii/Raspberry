<?php
include_once ('connection.php');
$db = new DB_Class();
	$query = mysql_query("SELECT  temperature FROM Temperature ORDER BY id DESC LIMIT 1");
	while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
    $temperature = $row['temperature'];
}
?>

<head>
<!-- Core libs -->
<SCRIPT LANGUAGE="JavaScript" SRC="common-graph.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript" SRC="common-object.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript" SRC="chart-core.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript" SRC="chart-thermometer.js"></SCRIPT>
</head>

<canvas id="c" width="100px" height="200px"
	style="border: 1 px solid blue;"
	></canvas>

<script>var temperature = "<?php echo $temperature; ?>";</script>
<script src="chart.js"></script>

<script>
var canvas=document.getElementById("c");
canvas.initRegionManager();
	onThermometer();
</script>