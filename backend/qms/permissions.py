from rest_framework import permissions


class IsTeacher(permissions.BasePermission):
    """
    Only  'teacher role permission.
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.userprofile.role == 'teacher'
        except:
            return False
