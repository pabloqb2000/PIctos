from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import imghdr
from pathlib import Path
import json

with open("./config.json", "r") as f:
    config = json.load(f)
img_path = config.get("IMG_PATH", "../display/imgs/image")

app = FastAPI()

class ImagePayload(BaseModel):
    image_base64: str


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

    # Write binary image to file
    with open(output_path, "wb") as f:
        f.write(image_bytes)

    return {"message": "Image saved", "filename": str(output_path)}
