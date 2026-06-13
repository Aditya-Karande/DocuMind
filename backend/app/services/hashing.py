from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

class Hash:

    def hash_password(password):
        return pwd_context.hash(password)

    def verify_password(plain, hased):
        return pwd_context.verify(plain, hased) 