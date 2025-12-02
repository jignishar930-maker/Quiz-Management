from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True) # પાસવર્ડ કન્ફર્મેશન માટે

    class Meta:
        model = User
        # આપણે username, password, password2 અને email ની જરૂર છે
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': True}, # ખાતરી કરો કે ઇમેઇલ જરૂરી છે
        }

    # ખાતરી કરો કે બંને પાસવર્ડ મેચ થાય છે
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "પાસવર્ડ ફીલ્ડ્સ મેચ થતા નથી."})
        return attrs

    # નવો યુઝર ડેટાબેઝમાં સેવ કરવા માટે
    def create(self, validated_data):
        # યુઝર ઓબ્જેક્ટ બનાવો
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            # set_password આપમેળે પાસવર્ડને hash કરશે
            password=validated_data['password']
        )
        return user