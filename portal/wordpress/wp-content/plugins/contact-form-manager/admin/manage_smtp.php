<?php 
$_POST = stripslashes_deep($_POST);
$_GET = stripslashes_deep($_GET);

$pageNumber = '';
if(isset($_GET['pagenum'])){
	$pageNumber = $_GET['pagenum'];
}
$xyz_cfm_smtpMessage = '';
if(isset($_GET['smtpmsg'])){
	$xyz_cfm_message = $_GET['smtpmsg'];
}
if($xyz_cfm_smtpMessage == 1){

	?>
<div class="system_notice_area_style1" id="system_notice_area">
	SMTP account successfully blocked.&nbsp;&nbsp;&nbsp;<span
		id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php 
}
if($xyz_cfm_smtpMessage == 2){

	?>
<div class="system_notice_area_style1" id="system_notice_area">
SMTP account successfully activated.&nbsp;&nbsp;&nbsp;<span
id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php
}
if($xyz_cfm_smtpMessage == 3){

	?>
<div class="system_notice_area_style0" id="system_notice_area">
SMTP account does not exist.&nbsp;&nbsp;&nbsp;<span
id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php
}
if($xyz_cfm_smtpMessage == 4){

	?>
<div class="system_notice_area_style0" id="system_notice_area">
Default SMTP account cannot be blocked.&nbsp;&nbsp;&nbsp;<span
id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php
}
if($xyz_cfm_smtpMessage == 5){

	?>
<div class="system_notice_area_style1" id="system_notice_area">
SMTP account successfully deleted.&nbsp;&nbsp;&nbsp;<span
id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php
}
if($xyz_cfm_smtpMessage == 6){

	?>
<div class="system_notice_area_style0" id="system_notice_area">
Default SMTP account cannot be deleted.&nbsp;&nbsp;&nbsp;<span
id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php
}
?>

<div >


	<form method="post">
		<fieldset
			style="width: 99%; border: 1px solid #F7F7F7; padding: 10px 0px;">
			<legend>SMTP Account List</legend>
			<?php 
			global $wpdb;
			$pagenum = isset( $_GET['pagenum'] ) ? absint( $_GET['pagenum'] ) : 1;
			$limit = get_option('xyz_cfm_paging_limit');			
			$offset = ( $pagenum - 1 ) * $limit;
			
			$entries = $wpdb->get_results( "SELECT * FROM xyz_cfm_sender_email_address  ORDER BY id DESC LIMIT $offset, $limit" );
			?>
			<input class="button-primary cfm_bottonWidth" id="textFieldButton2"
				style="cursor: pointer; margin-bottom:10px;" type="button"
				name="textFieldButton2" value="Add New SMTP Account"
				 onClick='document.location.href="<?php echo admin_url('admin.php?page=contact-form-manager-manage-smtp&action=add-smtp');?>"'>
			
			<table class="widefat" style="width: 99%; margin: 0 auto;border-bottom:none;">
				<thead>
					<tr>
						<th scope="col" style="">Email Address</th>
						<th scope="col" style="">Status</th>
						<th scope="col" colspan="3" style="text-align: center;">Action</th>
					</tr>
				</thead>
				<tbody>
					<?php 
					if( count($entries)>0 ) {
						
						$pageno = $pageNumber;
						if($pageno == ""){
							$pageno = 1;
						}
						
						$count=1;
						$class = '';
						foreach( $entries as $entry ) {
							$class = ( $count % 2 == 0 ) ? ' class="alternate"' : '';
							?>
					<tr <?php echo $class; ?>>
						<td><?php 
						echo $entry->user;
						?></td>
						
						<td>
							<?php 
								if($entry->status == 0){
									echo "Blocked";	
								}elseif ($entry->status == 1){
								echo "Active";	
								}
							
							?>
						</td>
						
						
					<?php 

				if($entry->status == 0){

					?>	
						
					
						<td style="text-align: center;"><a
							href='<?php echo admin_url('admin.php?page=contact-form-manager-manage-smtp&action=smtp-block&id='.$entry->id.'&status=1&pageno='.$pageno); ?>'><img
								id="img" title="Activate Account"
								src="<?php echo plugins_url('contact-form-manager/images/active.png')?>">
						</a>
						</td>
				<?php 

				}elseif ($entry->status == 1){

					?>
					
				<td style="text-align: center;"><a
							href='<?php echo admin_url('admin.php?page=contact-form-manager-manage-smtp&action=smtp-activate&id='.$entry->id.'&status=0&pageno='.$pageno); ?>'><img
								id="img" title="Block Account"
								src="<?php echo plugins_url('contact-form-manager/images/unsubscribe.png')?>">
						</a>
						</td>	
					
					<?php 
				}
				?>
						<td style="text-align: center;"><a
							href='<?php echo admin_url('admin.php?page=contact-form-manager-manage-smtp&action=smtp-edit&id='.$entry->id.'&pageno='.$pageno); ?>'><img
								id="img" title="Edit Account"
								src="<?php echo plugins_url('contact-form-manager/images/edit.png')?>">
						</a>
						</td>
						<td style="text-align: center;" ><a
							href='<?php echo admin_url('admin.php?page=contact-form-manager-manage-smtp&action=smtp-delete&id='.$entry->id.'&pageno='.$pageno); ?>'
							onclick="javascript: return confirm('Please click \'OK\' to confirm ');"><img
								id="img" title="Delete Account"
								src="<?php echo plugins_url('contact-form-manager/images/delete.png')?>">
						</a></td>
					</tr>
					<?php
					$count++;
						}
					} else { ?>
					<tr>
						<td colspan="5" id="bottomBorderNone">SMTP account not found</td>
					</tr>
					<?php } ?>
				</tbody>
			</table>
			<input class="button-primary cfm_bottonWidth" id="textFieldButton2"
				style="cursor: pointer;margin-top:10px; margin-bottom:10px;" type="button"
				name="textFieldButton2" value="Add New SMTP Account"
				 onClick='document.location.href="<?php echo admin_url('admin.php?page=contact-form-manager-manage-smtp&action=add-smtp');?>"'>
			<?php
			
			
			
			$total = $wpdb->get_var( "SELECT COUNT(`id`) FROM xyz_cfm_sender_email_address" );
			$num_of_pages = ceil( $total / $limit );

			$page_links = paginate_links( array(
					'base' => add_query_arg( 'pagenum','%#%'),
	    'format' => '',
	    'prev_text' =>  '&laquo;',
	    'next_text' =>  '&raquo;',
	    'total' => $num_of_pages,
	    'current' => $pagenum
			) );



			if ( $page_links ) {
				echo '<div class="tablenav" style="width:99%"><div class="tablenav-pages" style="margin: 1em 0">' . $page_links . '</div></div>';
			}

			?>

		</fieldset>

	</form>

</div>