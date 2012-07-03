<?php 
global $wpdb;
$_GET = stripslashes_deep($_GET);
$xyz_cfm_formpMessage = '';
if(isset($_GET['msg'])){
	$xyz_cfm_formpMessage = $_GET['msg'];
}
if($xyz_cfm_formpMessage == 1){

	?>
<div class="system_notice_area_style1" id="system_notice_area">
Contact form successfully deleted.&nbsp;&nbsp;&nbsp;<span
id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php

}

?>


<div >


	<form method="post">
		<fieldset
			style="width: 99%; border: 1px solid #F7F7F7; padding: 10px 0px;">
			<legend>Forms List</legend>
			<?php 
			global $wpdb;
			$pagenum = isset( $_GET['pagenum'] ) ? absint( $_GET['pagenum'] ) : 1;
			$limit = get_option('xyz_cfm_paging_limit');			
			$offset = ( $pagenum - 1 ) * $limit;
			
			$entries = $wpdb->get_results( "SELECT * FROM xyz_cfm_form  ORDER BY id DESC LIMIT $offset, $limit" );
			?>
			<input class="button-primary cfm_bottonWidth" id="textFieldButton2"
				style="cursor: pointer; margin-bottom:10px;" type="button"
				name="textFieldButton2" value="Add New Contact Form"
				 onClick='document.location.href="<?php echo admin_url('admin.php?page=contact-form-manager-managecontactforms&action=form-add');?>"'>
			<table class="widefat" style="width: 99%; margin: 0 auto; border-bottom:none;">
				<thead>
					<tr>
						<th scope="col" style="">Contact Form Name</th>
						<th scope="col" style="">Contact Form Short Code</th>
						<th scope="col" style="">Status</th>
						<th scope="col" colspan="2" style="text-align: center;">Action</th>
					</tr>
				</thead>
				<tbody>
					<?php 
					if( count($entries)>0 ) {
						$count=1;
						$class = '';
						foreach( $entries as $entry ) {
							$class = ( $count % 2 == 0 ) ? ' class="alternate"' : '';
							?>
					<tr <?php echo $class; ?>>
						<td><?php 
						echo $entry->name;
						?></td>
						<td><?php 
						if($entry->status == 2){echo 'NA';}
						else
						echo "[xyz-cfm-form id=".$entry->id."]";
						?></td>
						<td>
							<?php 
								if($entry->status == 2){
									echo "Draft";	
								}elseif ($entry->status == 1){
								echo "Active";	
								}
							
							?>
						</td>
						
						<td style="text-align: center;"><a
							href='<?php echo admin_url('admin.php?page=contact-form-manager-managecontactforms&action=form-edit&formId='.$entry->id.'&pageno='.$pagenum); ?>'><img
								id="img" title="Edit Form"
								src="<?php echo plugins_url('contact-form-manager/images/edit.png')?>">
						</a>
						</td>
						<td style="text-align: center;" ><a
							href='<?php echo admin_url('admin.php?page=contact-form-manager-managecontactforms&action=form-delete&id='.$entry->id.'&pageno='.$pagenum); ?>'
							onclick="javascript: return confirm('Please click \'OK\' to confirm ');"><img
								id="img" title="Delete Form"
								src="<?php echo plugins_url('contact-form-manager/images/delete.png')?>">
						</a></td>
					</tr>
					<?php
					$count++;
						}
					} else { ?>
					<tr>
						<td colspan="5" id="bottomBorderNone">Contact forms not found</td>
					</tr>
					<?php } ?>
				</tbody>
			</table>
			
			<input class="button-primary cfm_bottonWidth" id="textFieldButton2"
				style="cursor: pointer; margin-top:10px;" type="button"
				name="textFieldButton2" value="Add New Contact Form"
				 onClick='document.location.href="<?php echo admin_url('admin.php?page=contact-form-manager-managecontactforms&action=form-add');?>"'>
			
			<?php
			
			
			
			$total = $wpdb->get_var( "SELECT COUNT(`id`) FROM xyz_cfm_form" );
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
