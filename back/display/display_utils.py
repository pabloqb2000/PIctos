import pygame

def scale_height_and_crop_width(img_surf: pygame.Surface, target_size: tuple) -> pygame.Surface:
    """
    Scale the image so its height matches target_size[1], then center-crop horizontally
    to target_size[0]. Returns a new Surface (size = target_size).
    
    Args:
        img_surf: source pygame.Surface
        target_size: (target_width, target_height)
    
    Returns:
        pygame.Surface sized (target_width, target_height)
    """
    target_w, target_h = target_size
    src_w, src_h = img_surf.get_width(), img_surf.get_height()

    if target_h == src_h:
        return img_surf

    if src_h == 0:
        raise ValueError("Source surface has zero height")

    # Scale factor to match height exactly
    scale = target_h / src_h
    new_w = max(1, int(round(src_w * scale)))
    new_h = max(1, int(round(src_h * scale)))  # should equal target_h but keep robust

    # Smooth scale the source to new size
    scaled = pygame.transform.smoothscale(img_surf, (new_w, new_h)).convert_alpha()

    # Create destination surface (transparent if source had alpha, else same colorkey)
    dst = pygame.Surface((target_w, target_h), pygame.SRCALPHA, 32).convert_alpha()

    # If scaled width >= target width: crop centered horizontally
    if new_w >= target_w:
        offset_x = (new_w - target_w) // 2
        # blit scaled image so that the center portion fills dst
        dst.blit(scaled, (-offset_x, 0))
    else:
        # scaled width is smaller than target width — center it and leave bars either side
        offset_x = (target_w - new_w) // 2
        dst.blit(scaled, (offset_x, 0))

    return dst
