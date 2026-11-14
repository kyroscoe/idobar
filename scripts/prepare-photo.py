"""Optional image replacement tool. Requires Pillow: python -m pip install Pillow."""
import json,sys
from pathlib import Path
from PIL import Image,ImageOps
if len(sys.argv)!=3:
    raise SystemExit('Usage: python scripts/prepare-photo.py SLOT PATH_TO_IMAGE')
manifest=Path('src/photos.json')
photos=json.loads(manifest.read_text(encoding='utf8'))
slot=photos[sys.argv[1]]
image=ImageOps.exif_transpose(Image.open(sys.argv[2])).convert('RGB')
slot['width'],slot['height']=image.size
slot['widths']=[w for w in [480,960,1200] if w<=image.width] or [image.width]
for width in slot['widths']:
    image.resize((width,round(image.height*width/image.width)),Image.Resampling.LANCZOS).save(f"public/assets/{slot['file']}-{width}.webp",quality=83,method=6)
manifest.write_text(json.dumps(photos,indent=2)+'\n',encoding='utf8')
print('Updated image variants and dimensions. Update alt, source, and position in src/photos.json, then npm run check.')
