import secrets

token = secrets.token_urlsafe(48)

with open(".env", "a") as f:
    f.write(f"\nINTERNAL_LAMBDA_TOKEN={token}\n")

print("Token generado y guardado en .env")
