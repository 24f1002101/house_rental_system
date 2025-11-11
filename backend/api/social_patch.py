from allauth.socialaccount.internal.flows import signup as signup_flow

def disable_redirect_to_signup(*args, **kwargs):
    from allauth.socialaccount.models import SocialLogin
    sociallogin = args[1] if len(args) > 1 else kwargs.get('sociallogin')
    return sociallogin  # simply return without redirect

# Override allauth's redirect_to_signup
signup_flow.redirect_to_signup = disable_redirect_to_signup
