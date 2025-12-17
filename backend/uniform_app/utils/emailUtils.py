# Code added by Unnati on 26-05-2024
# Reason - To generate a random OTP and send it
import string
import random
from django.core.mail import send_mail
from django.utils.html import format_html


def generate_otp(length=6):
    digits = string.digits
    otp = ''.join(random.choice(digits) for _ in range(length))
    return otp


def send_otp(email, otp):
    from django.conf import settings
    ##Code added by Unnati on 30-10-2024
    ##Reason-Change subject
    # subject = 'Your OTP Code'
    subject = 'Reset Your Password for Global Power LLC'
    ##End of code addition by Unnati on 30-10-2024
    ##Reason-Change subject
    message = f'Your OTP code is {otp}.'
    # Code added by Unnati on 30-10-2024
    # Reason-Added html message
    html_message = format_html(
        """
    <h2>Reset Your Password for Global Power LLC</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password for your Global Power LLC account.</p>
    <p>To proceed with resetting your password, please use the following One-Time Password (OTP):</p>
    <h3>OTP: <strong>{}</strong></h3>
    <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
    <p>If you did not request this, please ignore this email, and your password will remain unchanged.</p>
    <p>Thank you!<br>Global Power LLC Team</p>
    """,
        otp
    )
    # End of code addition by Unnati on 30-10-2024
    # Reason-Added html message
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list             
              # Code added by Unnati on 30-10-2024
              # Reason-Added html message
              , html_message=html_message)
    # End of code addition by Unnati on 30-10-2024
    # Reason-Added html message
# End of code addition by Unnati on 26-05-2024
# Reason - To generate a random OTP and send it
