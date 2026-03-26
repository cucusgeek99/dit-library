import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "MON_SECRET_ACCESS_KEY" # À mettre dans un .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_access_token(user_id: int):
    user_id_str = str(user_id)
    access_expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_payload = {"sub": user_id_str, "exp": access_expire, "type": "access"}
    access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)

    # Refresh Token
    refresh_expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_payload = {"sub": user_id_str, "exp": refresh_expire, "type": "refresh"}
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


def refresh_token(refresh_token: str):
    # 1. Décoder et vérifier le refresh token
    payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    
    return payload