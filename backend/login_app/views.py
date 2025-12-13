from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User # UserProfile મોડેલ અહીં ઇમ્પોર્ટ થવું જરૂરી છે
from .serializers import RegisterSerializer
from django.shortcuts import render

# JWT ટોકન્સ મેળવવા માટેનું ફંક્શન
def get_tokens_for_user(user):
    """
    યુઝર માટે JWT refresh અને access tokens જનરેટ કરે છે.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def index_view(request):
    """Simple view to return a message indicating the API is running."""
    # આ ફક્ત બેકએન્ડ સ્ટેટસ ચેક માટે છે
    return render(request, 'index.html') 


class LoginView(APIView):
    """
    કસ્ટમ લૉગિન API: યુઝરને પ્રમાણિત કરે છે, JWT ટોકન્સ જનરેટ કરે છે અને રોલ પાછો મોકલે છે.
    """
    permission_classes = [permissions.AllowAny] # Login માટે કોઈ પ્રમાણીકરણની જરૂર નથી
    
    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Django ના ડિફોલ્ટ authenticate ફંક્શનનો ઉપયોગ કરીને યુઝરને ચકાસો
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # યુઝર સફળતાપૂર્વક પ્રમાણિત (authenticated) થયો
            
            # ૧. JWT ટોકન જનરેટ કરો (refresh અને access)
            token = get_tokens_for_user(user)
            
            # ૨. યુઝર પ્રોફાઇલમાંથી રોલ મેળવો
            try:
                # UserProfile મોડેલમાંથી રોલ મેળવવા માટે UserProfile મોડેલ અસ્તિત્વમાં હોવું જરૂરી છે
                user_profile = UserProfile.objects.get(user=user)
                role = user_profile.role
            except UserProfile.DoesNotExist:
                # જો UserProfile ન મળે, તો ડિફોલ્ટ 'student' રોલ આપો
                role = 'student' 

            # ટોકન, રોલ અને યુઝર ID સાથે સફળ પ્રતિસાદ (response) મોકલો
            return Response({
                'msg': 'Login Successful',
                # ફ્રન્ટએન્ડની api.js ફાઇલ Simple JWT ને અનુસરે છે, તેથી access અને refresh બંને મોકલો
                'access': token['access'],
                'refresh': token['refresh'],
                'role': role,
                'user_id': user.id # યુઝર ID પણ મોકલીએ છીએ
            }, status=status.HTTP_200_OK)
        else:
            # અમાન્ય ઓળખપત્રો (Invalid Credentials)
            return Response({'error': 'wrong username and  password'}, 
                            status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(generics.CreateAPIView):
    """
    યુઝર રજિસ્ટ્રેશન API: નવા યુઝર એકાઉન્ટ બનાવે છે.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # નોંધણી પછી UserProfile પણ બનાવો
        # ખાતરી કરો કે 'role' ફીલ્ડ રિક્વેસ્ટ ડેટામાં છે, અન્યથા ડિફોલ્ટ 'student' નો ઉપયોગ કરો.
        UserProfile.objects.create(
            user=user,
            role=request.data.get('role', 'student')
        )

        return Response({
            "user": serializer.data,
            "message": "success ! please login now.",
        }, status=status.HTTP_201_CREATED)