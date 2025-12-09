#!/usr/bin/python

import time
import pygame as pg
import os
from time import sleep
import json

from display_utils import scale_height_and_crop_width

with open("./config.json", "r") as f:
    config = json.load(f)

if config.get("SET_DEVICES", True):
    # set display device
    #os.putenv('SDL_VIDEODRIVER', 'fbcon')
    os.putenv('SDL_FBDEV', '/dev/fb1')

    # set mouse device
    #os.putenv('SDL_MOUSEDRV', 'TSLIB')
    #os.putenv('SDL_MOUSEDEV', '/dev/input/touchscreen')
    #os.putenv('SDL_MOUSEDEV', 'ADS7846 Touchscreen')

display_size = config.get("DISPLAY_SIZE", (320, 240))
bg_color = config.get("BG_COLOR", (255, 255, 255))
mouse_visible = config.get("MOUSE_VISIBLE", False)
dir_name = config.get("DIR_NAME", "./imgs/")
frame_duration = config.get("FRAME_DURATION", 0.1)

# init pg
pg.init()
screen = pg.display.set_mode(display_size)
screen.fill(bg_color)
pg.mouse.set_visible(mouse_visible)

n_shown_images = 0
img_hash = None
t0 = time.time()

# show mouse data
running = True
try:
    while running:
        for event in pg.event.get():
            if (event.type == pg.KEYDOWN and event.key == pg.K_ESCAPE) or event.type == pg.QUIT:
                running = False
                break
        
        try:
            file_name = next(name for name in os.listdir(dir_name) if name.startswith("image"))
            image = pg.image.load(dir_name + file_name)
            new_img_hash = hash(image)
            
            if new_img_hash != img_hash:
                
                new_image = scale_height_and_crop_width(image, display_size)
                x = (screen.get_width() - new_image.get_width()) // 2
                y = (screen.get_height() - new_image.get_height()) // 2
                
                screen.fill(bg_color)
                screen.blit(new_image, (x, y))
                pg.display.update()

                n_shown_images += 1
                img_hash = new_img_hash
        
        except Exception as e:
            pass
        
        sleep(max(frame_duration - (time.time() - t0), 0))
        t0 = time.time()
except KeyboardInterrupt:
    running = False

pg.quit()

print(f"Shown {n_shown_images:02d} images")

quit()
