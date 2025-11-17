import hashlib

def file_hash(file_obj):
    hasher = hashlib.md5()
    for chunk in file_obj.chunks():  # lee el archivo por partes
        hasher.update(chunk)
    file_obj.seek(0)  # resetear puntero del archivo
    return hasher.hexdigest()