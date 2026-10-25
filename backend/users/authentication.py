from rest_framework.authentication import SessionAuthentication


class SessionAuth(SessionAuthentication):
    """Session login, but "not logged in" is a 401 instead of DRF's default 403.

    With plain SessionAuthentication an expired session looked like "forbidden", so the
    frontend (which signs the user out on 401, see main.tsx) left them on a dashboard where
    every request failed. 403 now only means "logged in, but not allowed".
    """

    def authenticate_header(self, request):
        return 'Session'
