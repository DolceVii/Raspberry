<?php
include_once ('connection.php');
$db = new DB_Class();
	$query = mysql_query("SELECT  presure FROM Presure ORDER BY id DESC LIMIT 1");
	while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
    $presure = $row['presure'];
}
?>
<head>

<!-- Core libs -->
<SCRIPT LANGUAGE="JavaScript" SRC="common-graph.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript" SRC="common-object.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript" SRC="chart-core.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript" SRC="chart-presure.js"></SCRIPT>

</head>
<canvas id="c" width="1024px" height="600px"
	style="border: 1 px solid blue;"
	></canvas>

<script>var presure = "<?php echo $presure; ?>";</script>
<script src="chartpresure.js"></script>	
	
<script>
var canvas=document.getElementById("c");
canvas.initRegionManager();

	var rd=testRadialMeter();

</script>