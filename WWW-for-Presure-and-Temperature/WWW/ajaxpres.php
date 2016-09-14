<?php
include_once ('connection.php');
$db = new DB_Class();
if($_GET) {
    $query = "SELECT DATE_FORMAT(date, '%a, %b %e %Y %H:%i'), presure FROM Presure ORDER BY id LIMIT 72";
    $result = mysql_query( $query );
    $rows = array();
    while( $row = mysql_fetch_array( $result ) ) {
        $rows[] = array( '0' => $row['0'] , '1' => $row['1'] );
    }   
    print json_encode($rows, JSON_NUMERIC_CHECK);
}
?>