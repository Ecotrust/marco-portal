=== Contact Form Manager ===
Contributors: f1logic
Donate link: http://xyzscripts.com/donate/

Tags:  contact form, contact page, contact form plugin, contact, contact us, multiple contact forms, custom contact form, contact form with auto reply, contact form with recaptcha, contact form date picker,  contact manager, contact form manager, wordpress contact, TinyMCE form editor
Requires at least: 2.8
Tested up to: 3.3.1
Stable tag: 1.1
License: GPLv2 or later

Create contact form for your website.  Choose from a wide range of form elements .

== Description ==

A quick look into Contact Form Manager :

★ Supports text field, textarea, email field, dropdown, radiobutton & checkbox
★ Advanced fields like datepicker & file uploader
★ HTML editor to design contact form content
★ Recpatcha/image verification for spam control
★ Multiple custom forms with shortcode support
★ Auto-reply, redirection options on submit
★ Customizable mail body
★ SMTP mail settings


= Features in Detail =

The Contact Form Manager lets you create and manage multiple customized contact forms for your website. It supports a wide range of contact form elements such as text field, email field, textarea, dropdown list, radio button, checkbox, date picker, captcha, file uploader etc. Shortcodes are generated such that, you can modify contact form element properties without having to replace the shortcode everytime. 

The prominent features of  the contact form manager plugin are highlighted below.

= Supported Contact Form Elements =

    Text field
    Email field
    Textarea
    Dropdown List
    Checkbox
    Radiobutton
    Date picker
    Captcha
    File Uploader
    Submit Button

= Contact Form Content =

    Full control on contact form content
    Visual HTML editor for beautiful contact forms
    Style class integration option with contact form elements
    Option to add * (star symbol) for mandatory contact form fields
    Auto-save contact form elements on creation
    Multi language support for contact form messages
    Multiple Contact Forms

= Spam Control =

    Simple image verification
    Recaptcha support
    SMTP Email Settings

= Contact Form Display =	

    Shortcodes for displaying contact forms
    Modify contact form element options without replacing shortcode

= Contact Form Submission =

    Autoreply on contact form submission
    Redirection after contact form submission 


= About =

Contact Form  Manager is developed and maintained by [XYZScripts](http://xyzscripts.com/ "xyzscripts.com"). For any support, you may [contact us](http://xyzscripts.com/support/ "XYZScripts Support").

== Installation ==

1. Extract `contact-form-manager.zip` to your `/wp-content/plugins/` directory.
2. In the admin panel under plugins activate Contact Form Manager.
3. You can configure the basic settings from XYZ Contact menu.
4. Once settings are done, you may create contact forms and place the shortcodes on required pages
5. Please configure required keys if you plan to use recpatcha

If you need any further help, you may contact our [support desk](http://xyzscripts.com/support/ "XYZScripts Support").

== Frequently Asked Questions ==

= 1. The Contact Form Manager is not working properly. =

Please check the wordpress version you are using. Make sure it meets the minimum version recommended by us. Make sure all files of the `contact form manager` plugin uploaded to the folder `wp-content/plugins/`


= 2. How can I display the contact form in my website ? =

First you need to create a new contact form. Now in the XYZ Contact > Contact Forms page you can see the newly created contact form and its short code. Please copy this short code and paste in your contact page.


= 3. How can I add a field to my contact form ? =

To add a new field in the contact form, please click the edit contact form or add a new contact form link. Now you can see a section Form Elements and from here please select the Add Elements. No you can select the and create a new element or field.

= 4. Should I replace my contact form shortcode after editing the contact form element settings ? =

No. There is no need to replace the contact form shortcode after editing the contact form elements. It will update automatically and saves you from the trouble of replacing the code everytime.


= 5. How should I get a mail with all the fields used in the contact form ? =

In the mail content, please use all the codes corresponding to the fields you have used in the contact field. Please make sure that you have added all the tag codes (the code will be like [text-1], [email-2] etc.) in the email body. Custom fields like captcha and submit button cannot be used in mail.


= 6. Can I embed the contact form into my template file ? =


Yes, you can embed the contact form into your template file. You cannot directly add the shortcode in the template file but you will need to pass the code into do_shortcode() function and display its output like this:

<?php echo do_shortcode( '[xyz-cfm-form id=1]' ); ?>


= 7. I want to use contact form in my language, not in English. How can I do that ? =

For changing language, please check the [how-to-change-the-language-in-contact-form-manager](http://docs.xyzscripts.com/contact-form-manager/how-to-change-the-language-in-contact-form-manager/ "Contact Form Manager Documentation - Changing Language") section in our docs.


= 8. CAPTCHA does not work =

We are using 2 types of captcha in the contact form

    Simple image verification

    Recaptcha

If you are using the standard captcha, you need GD and FreeType library installed on your server.

If you are using the recaptcha, please make sure that you have configured the public key and private key.


= 9. Site Admin is not receiving any mail using the contact form =


While editing the 'Mail to site admin' section of a contact form, you need to specify the 'from email' address. Since you want the message from your visitor's email id, we are using the code of the user email here. The code is something like [email-2].

But in some servers, they don't allow to send emails with from addresses that are outside the server domain. So in such conditions, you need to add your own email address with the same domain extension of your server in the 'from email' section.

More questions ? [Drop a mail](http://xyzscripts.com/members/support/ "XYZScripts Support") and we shall get back to you with the answers.


== Screenshots ==

1. This is the contact form configuration page.
2. This is a sample contact form.

== Changelog ==

= 1.1 =
* Support for SMTP mailing
* Support for multiple contact forms in same page
* 9 preloaded language files  
* Fix for char encoding in emails
* A few other bug fixes

  
= 1.0 =
* First official launch.

== Upgrade Notice ==
If you require to use SMTP mailing, consider doing this upgrade. Also a few bugs such as character encoding issue in emails, multiple contact forms in same page were fixed.

== More Information ==

= Troubleshooting =

Please read the FAQ first if you are having problems.

= Requirements =

    WordPress 3.0+
    PHP 5+ 

= Feedback =

We would like to receive your feedback and suggestions about Contact Form Manager. You may submit them at our [support desk](http://xyzscripts.com/members/support/ "XYZScripts Support").
