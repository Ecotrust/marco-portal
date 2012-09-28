from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
import settings


def send_feedback(request):
    subject = settings.FEEDBACK_SUBJECT
    feedback_address = settings.FEEDBACK_RECIPIENT #, info@portal.midatlanticocean.org'
    name = request.POST.get('name', '')
    from_email = "%s <%s>" % (name, request.POST.get('email', ''),)
    reply_email = "feedback <%s>" % settings.FEEDBACK_RECIPIENT[0]
    url = request.POST.get('url', '')
    ua = request.META['HTTP_USER_AGENT']
    feedback_message = "From: %s\nURL: %s\nBrowser: %s\n\n\n%s" % (from_email, url, ua, request.POST.get('comment', ''),)
    thankyou_message = "Thank You.  \nWe appreciate your feedback on the MARCO website."
    thankyou_message += "\nYour comments have been sent to the appropriate staff members for review."
    thankyou_message += "\n\n-MARCO Portal technical staff"
    thankyou_message_recipient = [request.POST.get('email', '')]
    
    if name and feedback_message and from_email:
        try:
            #send email to feedback recipients (info@midatlanticocean.org)
            send_mail(subject, feedback_message, reply_email, feedback_address)
            #send acknowledgement email to user
            send_mail(subject, thankyou_message, reply_email, thankyou_message_recipient)
        except BadHeaderError:
            return HttpResponse('Invalid header found.')
        return HttpResponse('Thanks for your feedback.')
    else:
        # In reality we'd use a form class
        # to get proper validation errors.
        return HttpResponse('Make sure all fields are entered and valid.')

# def send_bookmark(request):
#     recipient = request.POST.get('recipient')
#     comment = request.POST.get('comment')
#     link = request.POST.get('link')
#     message = comment + '<p>' + link
#     subject = "a MARCO bookmark"
#     from_email = "info@portal.midatlanticocean.org"
    
#     if recipient:
#         try:
#             send_mail(subject, message, from_email, recipient)
#         except BadHeaderError:
#             return HttpResponse('Invalid header found.')
#         return HttpResponse('Bookmark Sent.')
#     else:
#         # In reality we'd use a form class
#         # to get proper validation errors.
#         return HttpResponse('Hmmm...Something went wrong. Try sending your bookmark again.')
