# backend/login_app/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile # UserProfile ને ઇમ્પોર્ટ કરો

# JWT ટોકન્સ મેળવવા માટેનું ફંક્શન
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class LoginView(APIView):
    # આ API POST રિક્વેસ્ટ હેન્ડલ કરશે
    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Django ના ડિફોલ્ટ authenticate ફંક્શનનો ઉપયોગ કરીને યુઝરને ચકાસો
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # યુઝર સફળતાપૂર્વક પ્રમાણિત (authenticated) થયો
            
            # ૧. JWT ટોકન જનરેટ કરો
            token = get_tokens_for_user(user)
            
            # ૨. યુઝર પ્રોફાઇલમાંથી રોલ મેળવો
            try:
                user_profile = UserProfile.objects.get(user=user)
                role = user_profile.role
            except UserProfile.DoesNotExist:
                # જો UserProfile ન મળે, તો ડિફોલ્ટ 'student' રોલ આપો
                role = 'student' 

            # ટોકન અને રોલ સાથે સફળ પ્રતિસાદ (response) મોકલો
            return Response({
                'msg': 'Login Successful',
                'token': token['access'], # ફક્ત access token જ ફ્રન્ટએન્ડને મોકલો
                'role': role
            }, status=status.HTTP_200_OK)
        else:
            # અમાન્ય ઓળખપત્રો (Invalid Credentials)
            return Response({'error': 'Invalid username or password'}, 
                            status=status.HTTP_401_UNAUTHORIZED)