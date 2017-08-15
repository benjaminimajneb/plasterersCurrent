PHP order system

Need PHP create database page.

INPUT
Drop down menu with pizza choices
drop down menu with times 
			if time A occurs < 15 in database A is available on menu
			if all times are 15, form replaced with 'Sorry, we are unable to take orders'
email address for confirmation (add to mailing list?)
name/number

			
submit - assign number to order (based on date?)
	disallow punctuation marks in name forms?
	if current date not in database start new subtable? necessary to lower risk of data loss.
	send data email to order address.
	
	Print menu with prices and descriptions underneath.

ARE THERE TWO WAYS TO DO THIS?
1) send data to serverside php document which processes the requests.
2) post this data to the DOM and have elements on the page change depending on whether info present in DOM.
i.e. email sent iff all form items filled with info.  Also if all forms are full then html changes to display this info and number but without 	
	

EMAIL SEND

mail(to,subject,message,headers,parameters);

Return Value:	Returns the hash value of the address parameter, or FALSE on failure. Note: Keep in mind that even if the email was accepted for delivery, it does NOT mean the email is actually sent and received!

BACKSIDE
search within date and time ranges 
	search criteria pizza (drop down with menu items, and 'all')
	plus total and total price and total different customers
	change pizza options


<?php
//establish connection - do we have to do this for every function?
$domain = "127.0.0.1"; //these are defined so can be reused later
$username = "root";
$password = "";
$DB = "pizzas";

$con=mysqli_connect($domain,$username,$password,$DB);
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
?>

<!--Email sending thing-->
			<?php
			
			function validate_input($x) {
				$x = trim($x);
				$x = stripslashes($x);
 				$x = htmlspecialchars($x);
 				return $x;
			}
 				
			if ($_SERVER["REQUEST_METHOD"] == "POST"){
			
				$name = validate_input($_POST['forename'].$_POST['surname']);
				$number = validate_input($_POST['mobile']);
				$email = validate_input($_POST['email']); //WHAT WILL HAPPEN IF THIS IS NOT SET?
				$order = validate_input($_POST['pizza']);
				$time = validate_input($_POST['time']);
			
			}
			
			$subject = "NEW ORDER".$orderNumber;
			$message = "<html> <p> NAME:".$name."<br> NUMBER: ".$number." <br> EMAIL: ".$email."<br> PIZZA ORDER: ".$order."<br> DELIVERY TIME:".$time."</html>"; //HERE SOME OF THE VARIABLES MAY BE UNDEFINED - WILL THIS BREAK THE PAGE?
			
			function createOrderNumber() { //finds highest order number for that day in DB, adds 1
				$orderNumberDate = date(dm);
				$existingOrders = mysqli_query($con,"SELECT orderNumber FROM orders");
				$nth=count($existingOrders);
			
	//Theory 2: only pull corresponding entries in DB where "date"==orderNumberDate. order  array. 
			
				$n=$existingOrders[$nth];
				$nPlus = $n+1;
				$orderNumber = $orderNumberDate.$nPlus;
			}
			
			if(isset($name) and isset($number) and isset($email) and isset($order) and isset($time)) {
				$complete=true;
			}
			
			function completePage() {
				if ($complete==true){
					createOrderNumber();
					mail('pizza@theplasterersarms.co.uk',$subject,$message);
					echo $ordernumber $name $number $email $order $time;
				
					//post to database
					//redesign page so form disappears replaced by summary.
					
				}
			
			}
			completePage();

			function hideForm() {
				if ($complete==true){
					echo "disabled";
				}
			}

			?>
			
<html>
	<body>
		<!--post info back into webpage... later on if all form elements are set, page redirects?-->
			<h1>Pizza?</h1>
		<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" <?php hideForm() ?> >
	
<!--for select drop downs, do we name individual items or the whole menu ie does name live in select tag or in option tag?-->
		<select name=''>
<?php			
			// list pizzas from menu DB
				$pizzas = mysqli_query($con,"SELECT * FROM menu");  //WHAT FORM DOES $pizzas TAKE HERE?

				while ($row=mysqli_fetch_array($pizzas)) {
				  echo "<option value='".$row['menuID']."'>" . $row['name']."</option>";  
				}
				?>

				<option> TEST </option>
			</select>

			<select name="time">
				<option id="timaA" value="12">12.00-12.30</option>
				<option id="timeB" value="12.5">12.30-13.00</option>
				<option id="timeC" value="13">13.00-12.30</option>
				<option id="timeD" value="13.5">13.30-14.00</option>
<!-- <script> add attribute disabled="disabled" if time slot full. -->
	
			</select>
			<br>
			
			<input type="text" name="forename" placeholder="Write yr first name pls."  /> 
			<br>
			<input type="text" name="surname" placeholder="Write yr surname pls." />			
			<br>
			<input type="number" name="mobile" placeholder="Write yr mobile number pls." />
			<br>
			<input type="email" name="email" placeholder="Write yr email address pls." />			
			<br>
			<input type="submit" name="submit" value="Submit"/>
		</form>	
		





		
	</body>
</html>
