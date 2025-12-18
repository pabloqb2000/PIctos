import os
from PIL import Image
from tqdm import tqdm

# -------- CONFIG --------
INPUT_FOLDER = "../../front/PIctos/public/imgs_src/"
OUTPUT_FOLDER = "../../front/PIctos/public/imgs/"
TARGET_WIDTH, TARGET_HEIGHT = (320, 240)
BACKGROUND_COLOR = (255, 255, 255)  # white
# ------------------------

SUPPORTED_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp")

def flatten_transparency(img, background_color):
    """
    Flattens any transparency onto a solid background color.
    Always returns an RGB image.
    """
    # Convert anything with possible transparency to RGBA first
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")

        background = Image.new("RGBA", img.size, background_color + (255,))
        img = Image.alpha_composite(background, img)

    return img.convert("RGB")

def resize_and_pad_image(path, output_path, target_w, target_h):
    with Image.open(path) as img:
        print(f"Opened: {os.path.basename(path)}")
        img = flatten_transparency(img, BACKGROUND_COLOR)
        w, h = img.size

        # Skip if already correct resolution
        if w == target_w and h == target_h:
            print(f"Skipping (already {target_w}x{target_h}): {os.path.basename(path)}")
            return

        # Compute scale to fit within target
        scale = min(target_w / w, target_h / h)
        new_w = int(w * scale)
        new_h = int(h * scale)

        resized = img.resize((new_w, new_h), Image.LANCZOS)

        # Create background canvas
        canvas = Image.new("RGB", (target_w, target_h), BACKGROUND_COLOR)

        # Center the image
        offset_x = (target_w - new_w) // 2
        offset_y = (target_h - new_h) // 2
        canvas.paste(resized, (offset_x, offset_y))

        canvas.save(output_path)
        print(f"Processed: {os.path.basename(path)}")


def main():
    for filename in tqdm(os.listdir(INPUT_FOLDER)):
        if filename.lower().endswith(SUPPORTED_EXTENSIONS):
            full_input_path = os.path.join(INPUT_FOLDER, filename)
            full_output_path = os.path.join(OUTPUT_FOLDER, filename)
            resize_and_pad_image(full_input_path, full_output_path, TARGET_WIDTH, TARGET_HEIGHT)


if __name__ == "__main__":
    main()
