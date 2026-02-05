from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    h = hashlib.sha256(password.encode("utf-8")).hexdigest()
    print("get_password_hash")
    return pwd_context.hash(h)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    h = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    ok = pwd_context.verify(h, hashed_password)
    print("verify_password", ok)
    return ok


def validate_password(password: str) -> bool:
    if len(password) < 8:
        return False
    if not any(c.isupper() for c in password):
        return False
    if not any(c.islower() for c in password):
        return False
    if not any(c.isdigit() for c in password):
        return False
    if not any(c in '!@#$%^&*(),.?":{}|<>' for c in password):
        return False
    return True
