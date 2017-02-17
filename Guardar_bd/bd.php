
<?php
$User = $_GET['NombreUsuario'];
$con = mysql_connect("localhost","root","1234");
if (!$con)
{
die('Could not connect: ' . mysql_error());
}
mysql_select_db("prueba", $con);

Insertar_Usuario($User);
echo "Mostrando datos de la base de datos: ";
?>


<?php
Sacar_resultado();
function Insertar_Usuario($User)
	{
	mysql_query("INSERT INTO Users (User) VALUES ('$User')") or die ("Failed to conect to database!!!");
	}

function Sacar_resultado()
	{
	$consulta = mysql_query("Select * From Users Order By PlayerId Desc")or die ("Error en la consulta");
		while($row=mysql_fetch_array($consulta))
		{ 
		echo "Usuario: ".$row['User'];
?>
		
<?php 	
		}
	}
mysql_close($con);
?>