import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import imghdr
from pathlib import Path
import json
from fastapi.middleware.cors import CORSMiddleware
from tenacity import retry, stop_after_delay, wait_random

with open("./config.json", "r") as f:
    config = json.load(f)
img_path = config.get("IMG_PATH", "../display/imgs/image")

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all origins
    allow_credentials=False,      # Must be False when allow_origins="*"
    allow_methods=["*"],          # Allow all HTTP methods
    allow_headers=["*"],          # Allow all headers
)

class ImagePayload(BaseModel):
    image_base64: str

@retry(
    stop=stop_after_delay(2),
    wait=wait_random(0, max=0.05)
)
def write_to_file(output_path: str, image_bytes: bytes):
    no_ext = '.'.join(output_path.split('.')[:-1])
    extensions = ["png", "jpg", "jpeg", "webp"]
    for ext in extensions:
        new_ext = f'{no_ext}.{ext}'
        if os.path.isfile(new_ext):
            os.remove(new_ext)
    
    with open(output_path, "wb+") as f:
        f.write(image_bytes)


@app.post("/upload-image")
async def upload_image(payload: ImagePayload):
    try:
        # Decode Base64
        image_bytes = base64.b64decode(payload.image_base64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 data")

    # Detect file type
    file_type = imghdr.what(None, image_bytes)

    # Map imghdr categories to allowed extensions
    allowed_extensions = {
        "png": "png",
        "jpeg": "jpg",   # imghdr returns 'jpeg' for both .jpg and .jpeg
        "webp": "webp"
    }

    if file_type not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    # Prepare file path
    ext = allowed_extensions[file_type]
    output_path = Path(f"{img_path}.{ext}")

    write_to_file(output_path=output_path, image_bytes=image_bytes)

    return {"message": "Image saved", "filename": str(output_path)}

@app.post("/eyes")
async def replace_with_eyes():
    ojos_file = Path("../display/imgs/ojos.png")

    if not ojos_file.exists():
        raise HTTPException(status_code=404, detail="ojos.png not found")

    # Read source file
    with open(ojos_file, "rb") as f:
        image_bytes = f.read()

    # Always save as image.png
    output_path = Path(f"{img_path}.png")

    write_to_file(output_path=str(output_path), image_bytes=image_bytes)

    return {"message": "Image replaced with ojos.png", "filename": str(output_path)}


@app.post("/hair")
async def replace_with_hair():
    pelo_file = Path("../display/imgs/pelo.png")

    if not pelo_file.exists():
        raise HTTPException(status_code=404, detail="pelo.png not found")

    # Read source file
    with open(pelo_file, "rb") as f:
        image_bytes = f.read()

    # Always save as image.png
    output_path = Path(f"{img_path}.png")

    write_to_file(output_path=str(output_path), image_bytes=image_bytes)

    return {"message": "Image replaced with pelo.png", "filename": str(output_path)}
