# ABRA FOOD

Marketing and ordering site for ABRA FOOD — "One Brand. Every Taste. Every
Table. Everywhere." Multi-outlet food brand covering cafe, catering, and
multiple menu categories, with online ordering, reservations, and careers.

## Tech stack

Static HTML, CSS, and vanilla JavaScript — no build step, no framework.
`devserver.py` is a small local dev server (disables caching so edits show
immediately, always serves from its own directory).

## Structure

- `index.html` — home page
- `menu.html`, `veg.html`, `non-veg.html` — menu pages
- `cafe.html`, `catering.html`, `outlet.html`, `locations.html` — brand format pages
- `order.html`, `reserve.html` — ordering and reservations
- `offers.html`, `events.html`, `careers.html`, `about.html`, `contact.html` — supporting pages
- `admin.html` — lightweight admin page
- `css/`, `js/`, `img/` — styles, scripts, and images

## Running locally

```bash
python devserver.py 8181
```
or, for a plain static server:
```bash
python -m http.server 8000
```
