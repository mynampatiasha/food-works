# 🍽️ ABRA FOOD

`Static Site` `HTML/CSS/JS` `Food & Beverage` `Multi-Outlet`

> One Brand. Every Taste. Every Table. Everywhere.

## What is ABRA FOOD?

Marketing and ordering site for ABRA FOOD, a multi-outlet food brand
covering cafe, catering, and multiple menu categories — with online
ordering, reservations, and careers.

## ✨ Features

- 🍜 Menu browsing (veg / non-veg)
- ☕ Cafe and 🍱 catering brand formats
- 🛍️ Online ordering
- 📅 Table reservations
- 💼 Careers page

## 🛠️ Tech Stack

Static **HTML**, **CSS**, and vanilla **JavaScript** — no build step, no
framework. `devserver.py` is a small local dev server (disables caching so
edits show immediately).

## 📁 Structure

```
index.html                                      # home page
menu.html, veg.html, non-veg.html                  # menu pages
cafe.html, catering.html, outlet.html,
locations.html                                       # brand format pages
order.html, reserve.html                              # ordering and reservations
offers.html, events.html, careers.html,
about.html, contact.html                                # supporting pages
admin.html                                                # lightweight admin page
css/, js/, img/                                            # styles, scripts, images
```

## 🚀 Running Locally

```bash
python devserver.py 8181
```
or
```bash
python -m http.server 8000
```
