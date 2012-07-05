  <div style="clear: both;"></div>

    <style>
    
    .xyz_feedback{
    background: #CEEAF7; /* Old browsers */
border: 1px solid #64cfe8;
width: 48%;    
height:200px;
    padding-left: 10px;
    float: left;
    
    }
    
    .xyz_feedback ul{
    font-weight: bold;
    }
    
    .xyz_feedback a{
    text-decoration: none
    }

    
    .xyz_subscribe{
    background: #bae598; /* Old browsers */
border: 1px solid #4d8a1d;
width: 48%;    
    padding-left: 10px;
    float:right;
height:200px;
    
    }
  .xyz_subscribe  td{
    padding:0;
    }
    
    </style>
<p></p>
<div style="width: 100%">
<fieldset
		style="width: 99%; border: 1px solid #F7F7F7; padding: 10px 0px;">
		
<table style="width:99%;margin: 0 auto">
<tr>
<td style="width:50%; padding: 0">
    <div class="xyz_feedback" style="width:99%;float: left;">
    <h2>Feedback</h2>

   Your feedback and suggestions are our sources for betterment of this plugin. You can provide your feedback using any of the options below.
   <p></p> 
   <ul style="float: left;">
   
   <li><a target="_blank" href="http://xyzscripts.com/donate/1">Donate a dollar</a></li>
   <li><a target="_blank" href="http://wordpress.org/extend/plugins/contact-form-manager/">Rate this plugin</a></li>
   <li><a target="_blank" href="http://xyzscripts.com/support/">Suggestions</a></li>
   </ul>
   <ul style="float: left;padding-left: 30px">
<li><a target="_blank" href="http://facebook.com/xyzscripts" class="xyz_fbook">Like us on facebook</a></li>
   <li><a target="_blank" href="http://twitter.com/xyzscripts" class="xyz_twitt">Follow us on twitter</a></li>
   <li><a target="_blank" href="https://plus.google.com/101215320403235276710/" class="xyz_gplus">+1 us on Google+</a></li>
      
   </ul>
   
    </div>
    </td>
<td>&nbsp;&nbsp;&nbsp;</td>
   
    <td style="width:50%;">
<div class="xyz_subscribe" style="width:99%;float: right;">


    <h2>Subscribe</h2>


Stay tuned to our updates by subscribing below.  


<div>
					
<script language="javascript">
function check_email(emailString)
{
    var mailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var matchArray = emailString.match(mailPattern);
    if (emailString.length == 0)
    return false;
       
    if (matchArray == null)    {
    return false;
    }else{
    return true;
    }
}

   
function verify_lists(form)
{
   
    var total=0;
    var checkBox=form['chk[]'];
   
    if(checkBox.length){
   
    for(var i=0;i<checkBox.length;i++){
    checkBox[i].checked?total++:null;
    }
    }else{
       
    checkBox.checked?total++:null;
       
    }
    if(total>0){
    return true;
    }else{
    return false;
    }

}
   
function verify_fields()
{

    if(check_email(document.email_subscription.email.value) == false){
    alert("Please check whether the email is correct.");
    document.email_subscription.email.select();
    return false;
    }else if(verify_lists(document.email_subscription)==false){
    alert("Select atleast one list.");
    }
    else{
    document.email_subscription.submit();
    }

}
</script>
<?php global $current_user; get_currentuserinfo(); ?>
<form action=http://xyzscripts.com/newsletter/index.php?page=list/subscribe method="post" name="email_subscription" id="email_subscription" >
<input type="hidden" name="fieldNameIds" value="1,">
<input type="hidden" name="redirActive" value="http://xyzscripts.com/subscription/pending/XYZWPCM">
<input type="hidden" name="redirPending" value="http://xyzscripts.com/subscription/active/XYZWPCM">
<input type="hidden" name="mode" value="1">
<table border="0" style=" width: 100%; color: black;">
<tr>
<td colspan="3" style="padding: 0px;">
<span style="font-size:14px;"><b>Field marked <font style="color:#FF0000">*</font> are mandatory </b></span>
</td>
</tr>
   
<tr><td colspan="3" style="padding: 0px;"> </td></tr>
   

<tr>
<td id="align" >Name</td>
<td id="align"  > : </td>
<td id="align" >
<input style="border: 1px solid #3fafe3; margin-right:10px;" type="text" name="field1" value="<?php  
if ($current_user->user_firstname != "" || $current_user->user_lastname != "") 
{
	echo $current_user->user_firstname . " " . $current_user->user_lastname; 
} 
else if (strcasecmp($current_user->display_name, 'admin')!=0 && strcasecmp($current_user->display_name , "administrator")!=0 ) 
{
	echo $current_user->display_name;
} 
else if (strcasecmp($current_user->user_login ,"admin")!=0 && strcasecmp($current_user->user_login , "administrator")!=0 ) 
{
	echo $current_user->user_login;	
}
?>"  ></td>
</tr>
<tr >
<td >Email Address</td><td > : </td>
<td >
<input style="border: 1px solid #3fafe3;" name="email"
type="text" value="<?php 	echo $current_user->user_email; ?>" /><span style="color:#FF0000">*</span>           
</td>
</tr>
<tr><td colspan="3" style="padding: 0px;"> </td></tr>

<input type="hidden" name="listName" value="5,1,"/>

<tr>
<td style="padding: 0px;"> </td><td style="padding: 0px;"> </td>
<td style="padding: 0px;">
<input class="button-primary cfm_bottonWidth" type="submit" value="subscribe" name="Submit"  onclick="javascript: if(!verify_fields()) return false; " />
</td>
<td style="padding: 0px;"> </td>
</tr>
<tr>
<td colspan="3" style="padding: 0px;"> </td>
</tr>
</table>
</form>
	</div>
				


</div>   
</td>
</tr>
</table> 
</fieldset>

    <div style="clear: both;"></div>
 <div style="width: 99%">
<div style="padding-top: 10px;float:left;">
Powered by <a href="http://xyzscripts.com" target="_blank">XYZScripts</a>
</div>
<div style="padding-top: 10px;float:right ;">
See Also : 
		<a target="_blank"	href="http://wordpress.org/extend/plugins/lightbox-pop/">Lightbox Pop</a>
		|
		<a target="_blank"	href="http://xyzscripts.com/wordpress-plugins/lightbox-pop/details">Lightbox Pop Premium</a>
		|
		<a target="_blank"	href="http://wordpress.org/extend/plugins/newsletter-manager/">Newsletter Manager</a>

</div>
 </div>   

    <div style="clear: both;"></div>

</div>
    <p style="clear: both;"></p>