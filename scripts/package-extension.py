"""Build a deterministic extension ZIP and unpacked folder for one editor origin."""
from pathlib import Path
from urllib.parse import urlsplit
import argparse
import hashlib
import json
import re
import zipfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--origin', required=True)
parser.add_argument('--development', action='store_true')
args = parser.parse_args()
url = urlsplit(args.origin)
local = url.hostname in ('localhost', '127.0.0.1')
if (url.scheme != 'https' and not (args.development and local and url.scheme == 'http')) or not url.hostname or url.username or url.password or url.query or url.fragment or url.path not in ('', '/'):
    parser.error('Use an HTTPS origin, or --development with an HTTP localhost origin.')
if not args.development and (local or url.hostname.endswith('.chatgpt.site') or url.hostname.endswith('.example')):
    parser.error('Release packages require a verified public editor origin.')
origin = f'{url.scheme}://{url.netloc}'
root = Path(__file__).resolve().parents[1]
extension = root / 'extension'
unpacked = root / '.sites-runtime' / 'extension'
unpacked.mkdir(parents=True, exist_ok=True)
files = ['manifest.json', 'background.js', 'content.js', 'popup.js', 'popup.html', 'popup.css', 'README.md']
files += [f'icon{s}.png' for s in (16, 32, 48, 128)]
output = root / 'public' / 'once-extension.zip'
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for name in sorted(files):
        body = (extension / name).read_bytes()
        if name in ('background.js', 'popup.js'):
            source, count = re.subn(r"const ORIGIN='[^']+';", 'const ORIGIN=' + json.dumps(origin) + ';', body.decode(), count=1)
            if count != 1:
                raise ValueError(f'Missing origin in {name}')
            body = source.encode()
        (unpacked / name).write_bytes(body)
        info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        archive.writestr(info, body)
print(json.dumps({'version': json.loads((extension/'manifest.json').read_text())['version'], 'origin': origin, 'unpacked': str(unpacked), 'bytes': output.stat().st_size, 'sha256': hashlib.sha256(output.read_bytes()).hexdigest()}))
