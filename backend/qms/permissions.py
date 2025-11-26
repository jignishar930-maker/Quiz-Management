from rest_framework import permissions


class IsTeacher(permissions.BasePermission):
    """
    ફક્ત 'teacher' રોલ ધરાવતા યુઝર્સને જ પરવાનગી આપો.
    """
    def has_permission(self, request, view):
        # યુઝર ઓથેન્ટિકેટેડ હોવો જરૂરી છે
        if not request.user.is_authenticated:
            return False
            
        # login_app માંથી UserProfile મેળવો અને રોલ ચેક કરો
        try:
            return request.user.userprofile.role == 'teacher'
        except:
            return False # જો UserProfile ન મળે તો
