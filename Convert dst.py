import sys
from pyembroidery import EmbPattern, write_dst
from PIL import Image

input_file = sys.argv[1]
output_file = sys.argv[2]

img = Image.open(input_file).convert("1")  # Black & white

pattern = EmbPattern()

width, height = img.size

# Simple pixel-to-stitch mapping
for y in range(height):
    for x in range(width):
        if img.getpixel((x, y)) == 0:  # Black pixel
            pattern.add_stitch_abs(x, y)

write_dst(pattern, output_file)
