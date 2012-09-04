from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect

subject = "MARCO Feedback"

def send_feedback(request):
	feedback_address = ['eknuth@ecotrust.org']#, info@midatlanticocean.org'
	name = request.POST.get('name', '')
	message = request.POST.get('comment', '')
	from_email = request.POST.get('email', '')

	if name and message and from_email:
		try:
			send_mail(subject, message, from_email, feedback_address)
		except BadHeaderError:
			return HttpResponse('Invalid header found.')
		return HttpResponseRedirect('Thanks for your feedback.')
	else:
		# In reality we'd use a form class
		# to get proper validation errors.
		return HttpResponse('Make sure all fields are entered and valid.')
