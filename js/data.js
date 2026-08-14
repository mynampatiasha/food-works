/* =========================================================
   ABRA FOOD — Central Data Layer
   ---------------------------------------------------------
   This file simulates the database/API that a real backend
   would serve (Country > State > City > Outlet > Brand >
   Menu, plus Offers, Chefs, Careers, Reviews).

   Every page reads through the ABRA.data namespace instead
   of hard-coding content, and ABRA.store (store.js) can
   override any of it from localStorage (see admin.html).
   That's what lets 1 outlet grow to 1,000 without a rebuild:
   new pages just query this same shape with a different id.
   ========================================================= */

window.ABRA = window.ABRA || {};

ABRA.brands = [
  {
    id: "veg",
    name: "ABRA VEG",
    tagline: "Pure Vegetarian Dining",
    desc: "South Indian, North Indian, Continental, Chinese, Jain & Healthy Food — crafted with pure vegetarian ingredients.",
    cuisines: ["South Indian", "North Indian", "Continental", "Chinese", "Jain", "Healthy Food"],
    color: "veg",
    icon: "🥗"
  },
  {
    id: "nonveg",
    name: "ABRA NON-VEG",
    tagline: "Authentic Non-Vegetarian Cuisine",
    desc: "Chicken, Mutton, Seafood, Biryani, Tandoori, Kebabs & Grill — bold flavours, slow-cooked traditions.",
    cuisines: ["Chicken", "Mutton", "Seafood", "Biryani", "Tandoori", "Kebabs", "Grill"],
    color: "nonveg",
    icon: "🍗"
  },
  {
    id: "cafe",
    name: "ABRA CAFÉ",
    tagline: "Coffee • Bakery • Snacks • Desserts",
    desc: "Coffee, Tea, Bakery, Sandwiches, Pizza & Desserts — your everyday neighbourhood café.",
    cuisines: ["Coffee", "Tea", "Bakery", "Sandwiches", "Pizza", "Desserts"],
    color: "cafe",
    icon: "☕"
  }
];

/* ---------- Locations: Country > State > City > Outlets ---------- */
ABRA.locations = [
  {
    code: "IN", name: "India", currency: "₹",
    states: [
      {
        code: "KA", name: "Karnataka",
        cities: [
          {
            code: "BLR", name: "Bengaluru",
            outlets: ["veg-whitefield", "nonveg-koramangala", "cafe-indiranagar"]
          },
          { code: "MYS", name: "Mysuru", outlets: ["veg-mysuru"] }
        ]
      },
      {
        code: "MH", name: "Maharashtra",
        cities: [
          { code: "MUM", name: "Mumbai", outlets: ["nonveg-andheri", "cafe-bandra"] },
          { code: "PUN", name: "Pune", outlets: ["veg-baner"] }
        ]
      },
      {
        code: "TN", name: "Tamil Nadu",
        cities: [ { code: "CHN", name: "Chennai", outlets: ["veg-anna-nagar"] } ]
      }
    ]
  },
  {
    code: "AE", name: "UAE", currency: "AED",
    states: [
      { code: "DXB", name: "Dubai", cities: [ { code: "DXB", name: "Dubai", outlets: ["nonveg-jumeirah", "cafe-marina"] } ] }
    ]
  },
  {
    code: "GB", name: "United Kingdom", currency: "£",
    states: [
      { code: "LDN", name: "London", cities: [ { code: "LDN", name: "London", outlets: ["cafe-shoreditch"] } ] }
    ]
  }
];

/* ---------- Outlets ---------- */
ABRA.outlets = [
  {
    slug: "veg-whitefield", name: "ABRA VEG — Whitefield", brand: "veg",
    country: "IN", state: "Karnataka", city: "Bengaluru", area: "Whitefield",
    address: "2nd Floor, ITPL Main Road, Whitefield, Bengaluru 560066",
    phone: "+91 80 4567 1234", hours: "11:00 AM – 11:00 PM (All days)",
    rating: 4.6, reviews: 812,
    services: ["Dine-in", "Delivery", "Pickup", "Table Booking", "Party Hall"],
    facilities: ["AC Seating", "Parking", "Wheelchair Access", "Family Section", "Free WiFi"],
    parking: "Valet & self-parking available"
  },
  {
    slug: "nonveg-koramangala", name: "ABRA NON-VEG — Koramangala", brand: "nonveg",
    country: "IN", state: "Karnataka", city: "Bengaluru", area: "Koramangala",
    address: "80 Feet Road, 5th Block, Koramangala, Bengaluru 560095",
    phone: "+91 80 4567 5678", hours: "12:00 PM – 12:00 AM (All days)",
    rating: 4.7, reviews: 1204,
    services: ["Dine-in", "Delivery", "Pickup", "Table Booking", "Live Grill"],
    facilities: ["AC Seating", "Rooftop", "Parking", "Bar", "Free WiFi"],
    parking: "Basement parking (60 cars)"
  },
  {
    slug: "cafe-indiranagar", name: "ABRA CAFÉ — Indiranagar", brand: "cafe",
    country: "IN", state: "Karnataka", city: "Bengaluru", area: "Indiranagar",
    address: "100 Feet Road, Indiranagar, Bengaluru 560038",
    phone: "+91 80 4567 9012", hours: "7:30 AM – 11:00 PM (All days)",
    rating: 4.5, reviews: 640,
    services: ["Dine-in", "Delivery", "Pickup", "Co-working Corner"],
    facilities: ["AC Seating", "Outdoor Seating", "Free WiFi", "Pet Friendly"],
    parking: "Street parking"
  },
  {
    slug: "veg-mysuru", name: "ABRA VEG — Mysuru", brand: "veg",
    country: "IN", state: "Karnataka", city: "Mysuru", area: "Vijayanagar",
    address: "Vijayanagar 2nd Stage, Mysuru 570017",
    phone: "+91 821 456 7890", hours: "11:00 AM – 10:30 PM (All days)",
    rating: 4.4, reviews: 356,
    services: ["Dine-in", "Delivery", "Pickup", "Table Booking"],
    facilities: ["AC Seating", "Parking", "Family Section"],
    parking: "Front-of-store parking"
  },
  {
    slug: "nonveg-andheri", name: "ABRA NON-VEG — Andheri", brand: "nonveg",
    country: "IN", state: "Maharashtra", city: "Mumbai", area: "Andheri West",
    address: "Link Road, Andheri West, Mumbai 400053",
    phone: "+91 22 4567 3456", hours: "12:00 PM – 12:30 AM (All days)",
    rating: 4.5, reviews: 980,
    services: ["Dine-in", "Delivery", "Pickup", "Table Booking", "Banquet"],
    facilities: ["AC Seating", "Valet Parking", "Bar", "Banquet Hall"],
    parking: "Valet parking"
  },
  {
    slug: "cafe-bandra", name: "ABRA CAFÉ — Bandra", brand: "cafe",
    country: "IN", state: "Maharashtra", city: "Mumbai", area: "Bandra West",
    address: "Linking Road, Bandra West, Mumbai 400050",
    phone: "+91 22 4567 7890", hours: "8:00 AM – 11:30 PM (All days)",
    rating: 4.6, reviews: 512,
    services: ["Dine-in", "Delivery", "Pickup"],
    facilities: ["AC Seating", "Outdoor Seating", "Free WiFi"],
    parking: "Paid public parking nearby"
  },
  {
    slug: "veg-baner", name: "ABRA VEG — Baner", brand: "veg",
    country: "IN", state: "Maharashtra", city: "Pune", area: "Baner",
    address: "Baner Road, Pune 411045",
    phone: "+91 20 4567 2345", hours: "11:00 AM – 11:00 PM (All days)",
    rating: 4.5, reviews: 421,
    services: ["Dine-in", "Delivery", "Pickup", "Table Booking"],
    facilities: ["AC Seating", "Parking", "Free WiFi"],
    parking: "On-site parking"
  },
  {
    slug: "veg-anna-nagar", name: "ABRA VEG — Anna Nagar", brand: "veg",
    country: "IN", state: "Tamil Nadu", city: "Chennai", area: "Anna Nagar",
    address: "2nd Avenue, Anna Nagar, Chennai 600040",
    phone: "+91 44 4567 6789", hours: "11:00 AM – 10:30 PM (All days)",
    rating: 4.6, reviews: 588,
    services: ["Dine-in", "Delivery", "Pickup", "Table Booking"],
    facilities: ["AC Seating", "Parking", "Family Section"],
    parking: "On-site parking"
  },
  {
    slug: "nonveg-jumeirah", name: "ABRA NON-VEG — Jumeirah", brand: "nonveg",
    country: "AE", state: "Dubai", city: "Dubai", area: "Jumeirah",
    address: "Jumeirah Beach Road, Dubai, UAE",
    phone: "+971 4 567 1234", hours: "1:00 PM – 1:00 AM (All days)",
    rating: 4.8, reviews: 690,
    services: ["Dine-in", "Delivery", "Pickup", "Table Booking", "Shisha Lounge"],
    facilities: ["AC Seating", "Sea View", "Valet Parking", "Private Dining"],
    parking: "Valet parking"
  },
  {
    slug: "cafe-marina", name: "ABRA CAFÉ — Marina", brand: "cafe",
    country: "AE", state: "Dubai", city: "Dubai", area: "Dubai Marina",
    address: "Marina Walk, Dubai Marina, UAE",
    phone: "+971 4 567 5678", hours: "7:00 AM – 12:00 AM (All days)",
    rating: 4.7, reviews: 310,
    services: ["Dine-in", "Delivery", "Pickup"],
    facilities: ["Marina View", "Outdoor Seating", "Free WiFi"],
    parking: "Mall parking"
  },
  {
    slug: "cafe-shoreditch", name: "ABRA CAFÉ — Shoreditch", brand: "cafe",
    country: "GB", state: "London", city: "London", area: "Shoreditch",
    address: "Brick Lane, Shoreditch, London E1",
    phone: "+44 20 7946 1234", hours: "8:00 AM – 10:00 PM (All days)",
    rating: 4.5, reviews: 198,
    services: ["Dine-in", "Delivery", "Pickup"],
    facilities: ["Free WiFi", "Outdoor Seating"],
    parking: "Street parking"
  }
];

/* ---------- Menu categories per brand ---------- */
ABRA.categories = {
  veg: ["Breakfast", "Starters", "Main Course", "Rice & Biryani", "Breads", "Desserts", "Beverages"],
  nonveg: ["Starters", "Tandoori & Kebabs", "Biryani", "Curries", "Grill", "Seafood", "Beverages"],
  cafe: ["Coffee", "Tea", "Bakery", "Sandwiches", "Pizza", "Desserts"]
};

/* ---------- Menu items ---------- */
/* outlets:"all" = available at every outlet of that brand; else array of outlet slugs */
ABRA.menu = [
  // ABRA VEG
  { id:"v1", brand:"veg", category:"Breakfast", name:"Masala Dosa", desc:"Crisp rice crepe with spiced potato filling, served with sambar & chutney.", price:149, veg:true, popular:true, outlets:"all" },
  { id:"v2", brand:"veg", category:"Breakfast", name:"Idli Vada Combo", desc:"Steamed rice cakes with lentil fritters, sambar & coconut chutney.", price:129, veg:true, outlets:"all" },
  { id:"v3", brand:"veg", category:"Starters", name:"Paneer Tikka", desc:"Char-grilled cottage cheese marinated in tandoori spices.", price:239, veg:true, popular:true, outlets:"all" },
  { id:"v4", brand:"veg", category:"Starters", name:"Gobi Manchurian", desc:"Crispy cauliflower tossed in Indo-Chinese Manchurian sauce.", price:199, veg:true, outlets:"all" },
  { id:"v5", brand:"veg", category:"Main Course", name:"Paneer Butter Masala", desc:"Cottage cheese cubes in a rich buttery tomato gravy.", price:279, veg:true, popular:true, outlets:"all" },
  { id:"v6", brand:"veg", category:"Main Course", name:"Dal Makhani", desc:"Slow-cooked black lentils finished with cream & butter.", price:229, veg:true, outlets:"all" },
  { id:"v7", brand:"veg", category:"Main Course", name:"Jain Vegetable Kofta", desc:"No onion no garlic kofta curry, made Jain-style.", price:259, veg:true, outlets:["veg-whitefield","veg-baner"] },
  { id:"v8", brand:"veg", category:"Rice & Biryani", name:"Veg Dum Biryani", desc:"Basmati rice layered with mixed vegetables & saffron, dum-cooked.", price:249, veg:true, popular:true, outlets:"all" },
  { id:"v9", brand:"veg", category:"Breads", name:"Butter Naan", desc:"Tandoor-baked leavened bread brushed with butter.", price:59, veg:true, outlets:"all" },
  { id:"v10", brand:"veg", category:"Desserts", name:"Gulab Jamun", desc:"Soft milk dumplings soaked in rose-cardamom syrup.", price:99, veg:true, outlets:"all" },
  { id:"v11", brand:"veg", category:"Beverages", name:"Filter Coffee", desc:"South Indian style decoction filter coffee.", price:69, veg:true, outlets:"all" },
  { id:"v12", brand:"veg", category:"Main Course", name:"Continental Veg Platter", desc:"Grilled vegetables, herbed rice & garlic bread.", price:299, veg:true, outlets:["veg-whitefield"] },

  // ABRA NON-VEG
  { id:"n1", brand:"nonveg", category:"Starters", name:"Chicken 65", desc:"Deep-fried spicy chicken bites tossed in curry leaves & chillies.", price:269, veg:false, popular:true, outlets:"all" },
  { id:"n2", brand:"nonveg", category:"Tandoori & Kebabs", name:"Tandoori Chicken (Half)", desc:"Charcoal-grilled chicken marinated overnight in yoghurt & spices.", price:329, veg:false, popular:true, outlets:"all" },
  { id:"n3", brand:"nonveg", category:"Tandoori & Kebabs", name:"Mutton Seekh Kebab", desc:"Minced mutton skewers grilled in the tandoor.", price:369, veg:false, outlets:"all" },
  { id:"n4", brand:"nonveg", category:"Biryani", name:"Hyderabadi Chicken Biryani", desc:"Dum-cooked basmati rice with marinated chicken & fried onions.", price:299, veg:false, popular:true, outlets:"all" },
  { id:"n5", brand:"nonveg", category:"Biryani", name:"Mutton Biryani", desc:"Slow dum-cooked biryani with tender mutton pieces.", price:379, veg:false, outlets:"all" },
  { id:"n6", brand:"nonveg", category:"Curries", name:"Butter Chicken", desc:"Tandoori chicken simmered in a creamy tomato-butter gravy.", price:319, veg:false, popular:true, outlets:"all" },
  { id:"n7", brand:"nonveg", category:"Curries", name:"Mutton Rogan Josh", desc:"Kashmiri-style slow-cooked mutton curry.", price:389, veg:false, outlets:["nonveg-koramangala","nonveg-andheri","nonveg-jumeirah"] },
  { id:"n8", brand:"nonveg", category:"Seafood", name:"Grilled Fish Tikka", desc:"Marinated fish fillets grilled to perfection.", price:349, veg:false, outlets:"all" },
  { id:"n9", brand:"nonveg", category:"Seafood", name:"Prawn Masala", desc:"Jumbo prawns tossed in a coastal spice masala.", price:399, veg:false, outlets:["nonveg-koramangala","nonveg-jumeirah"] },
  { id:"n10", brand:"nonveg", category:"Grill", name:"Mixed Grill Platter", desc:"Chicken tikka, seekh kebab & tandoori prawns on one platter.", price:499, veg:false, popular:true, outlets:"all" },
  { id:"n11", brand:"nonveg", category:"Beverages", name:"Masala Buttermilk", desc:"Spiced chilled buttermilk.", price:59, veg:true, outlets:"all" },

  // ABRA CAFÉ
  { id:"c1", brand:"cafe", category:"Coffee", name:"Cappuccino", desc:"Espresso with steamed milk foam.", price:159, veg:true, popular:true, outlets:"all" },
  { id:"c2", brand:"cafe", category:"Coffee", name:"Cold Brew", desc:"Slow-steeped 18-hour cold brew coffee.", price:179, veg:true, outlets:"all" },
  { id:"c3", brand:"cafe", category:"Tea", name:"Masala Chai", desc:"Classic Indian spiced tea.", price:99, veg:true, outlets:"all" },
  { id:"c4", brand:"cafe", category:"Bakery", name:"Butter Croissant", desc:"Flaky, buttery, freshly baked croissant.", price:129, veg:true, popular:true, outlets:"all" },
  { id:"c5", brand:"cafe", category:"Bakery", name:"Chocolate Muffin", desc:"Rich double-chocolate chip muffin.", price:119, veg:true, outlets:"all" },
  { id:"c6", brand:"cafe", category:"Sandwiches", name:"Grilled Veg Sandwich", desc:"Loaded vegetable sandwich with herbed mayo, grilled golden.", price:189, veg:true, outlets:"all" },
  { id:"c7", brand:"cafe", category:"Sandwiches", name:"Chicken Club Sandwich", desc:"Triple-layer sandwich with grilled chicken, egg & bacon.", price:229, veg:false, popular:true, outlets:"all" },
  { id:"c8", brand:"cafe", category:"Pizza", name:"Margherita Pizza", desc:"Classic tomato, mozzarella & basil on a thin crust.", price:299, veg:true, outlets:"all" },
  { id:"c9", brand:"cafe", category:"Pizza", name:"Pepperoni Pizza", desc:"Loaded with pepperoni & mozzarella cheese.", price:349, veg:false, outlets:["cafe-indiranagar","cafe-bandra","cafe-marina","cafe-shoreditch"] },
  { id:"c10", brand:"cafe", category:"Desserts", name:"New York Cheesecake", desc:"Classic baked cheesecake with berry compote.", price:219, veg:true, popular:true, outlets:"all" },
  { id:"c11", brand:"cafe", category:"Desserts", name:"Belgian Waffle", desc:"Crisp waffle served with maple syrup & ice cream.", price:239, veg:true, outlets:"all" }
];

/* ---------- Offers (location/brand specific) ---------- */
ABRA.offers = [
  { id:"o1", title:"Weekend Family Combo", desc:"20% off on all family-size combos, every Sat–Sun.", brand:"veg", outlet:"veg-whitefield", validTill:"2026-12-31", tag:"Weekend Special" },
  { id:"o2", title:"Biryani Lunch Deal", desc:"Flat ₹50 off on Biryani orders between 12–3 PM.", brand:"nonveg", outlet:"nonveg-koramangala", validTill:"2026-09-30", tag:"Lunch Combo" },
  { id:"o3", title:"Café Happy Hours", desc:"Buy 1 Get 1 on all coffees, 4–6 PM daily.", brand:"cafe", outlet:"cafe-indiranagar", validTill:"2026-10-15", tag:"Happy Hours" },
  { id:"o4", title:"ABRA CLUB Birthday Treat", desc:"Free dessert for ABRA CLUB members on their birthday.", brand:"all", outlet:"all", validTill:"2026-12-31", tag:"ABRA Club" },
  { id:"o5", title:"New Outlet Launch — Baner", desc:"15% off your first order at ABRA VEG Baner.", brand:"veg", outlet:"veg-baner", validTill:"2026-11-01", tag:"New Outlet" },
  { id:"o6", title:"Festival Feast", desc:"Special festival thali at 10% off, all Chennai outlets.", brand:"veg", outlet:"veg-anna-nagar", validTill:"2026-11-14", tag:"Festival" },
  { id:"o7", title:"Grill Night Special", desc:"Flat 25% off Mixed Grill Platter after 8 PM.", brand:"nonveg", outlet:"nonveg-jumeirah", validTill:"2026-12-31", tag:"Weekend Special" },
];

/* ---------- Chefs ---------- */
ABRA.chefs = [
  { id:"ch1", name:"Chef Arvind Rao", title:"Executive Chef", specialty:"South Indian Cuisine", signature:"Whitefield Special Masala Dosa", exp:"18 years", outlet:"veg-whitefield" },
  { id:"ch2", name:"Chef Imran Sheikh", title:"Head Chef — Grill", specialty:"Tandoori & Kebabs", signature:"Mixed Grill Platter", exp:"15 years", outlet:"nonveg-koramangala" },
  { id:"ch3", name:"Chef Meera Nair", title:"Pastry Chef", specialty:"Bakery & Desserts", signature:"New York Cheesecake", exp:"10 years", outlet:"cafe-indiranagar" },
  { id:"ch4", name:"Chef Faisal Al Marri", title:"Regional Chef — Gulf", specialty:"Seafood & Grill", signature:"Grilled Fish Tikka", exp:"12 years", outlet:"nonveg-jumeirah" },
];

/* ---------- Careers ---------- */
ABRA.jobs = [
  { id:"j1", title:"Restaurant Manager", dept:"Restaurant Operations", location:"Bengaluru, India", type:"Full-time" },
  { id:"j2", title:"Chef de Partie", dept:"Kitchen", location:"Mumbai, India", type:"Full-time" },
  { id:"j3", title:"Barista", dept:"Café Operations", location:"Dubai, UAE", type:"Full-time" },
  { id:"j4", title:"Delivery Rider", dept:"Logistics", location:"Bengaluru, India", type:"Part-time" },
  { id:"j5", title:"Software Engineer — Ordering Platform", dept:"Technology", location:"Remote / Bengaluru", type:"Full-time" },
  { id:"j6", title:"Marketing Executive", dept:"Marketing", location:"Mumbai, India", type:"Full-time" },
];

/* ---------- Testimonials ---------- */
ABRA.reviews = [
  { id:"r1", outlet:"veg-whitefield", name:"Sanjana K.", rating:5, text:"Best filter coffee in Whitefield, hands down. The dosa was crisp and the service was quick even on a busy Sunday." },
  { id:"r2", outlet:"nonveg-koramangala", name:"Rahul V.", rating:5, text:"The mixed grill platter is unreal. Great ambience for a weekend dinner with friends." },
  { id:"r3", outlet:"cafe-indiranagar", name:"Priya S.", rating:4, text:"Lovely café to work from — good WiFi, great cold brew, and the croissants are always fresh." },
  { id:"r4", outlet:"nonveg-jumeirah", name:"Omar H.", rating:5, text:"Sea view, incredible tandoori chicken, and very professional staff. Will be back." },
];

/* ---------- Helper accessors ---------- */
ABRA.getBrand = id => ABRA.brands.find(b => b.id === id);
ABRA.getOutlet = slug => ABRA.outlets.find(o => o.slug === slug);
ABRA.getOutletsByBrand = brandId => ABRA.outlets.filter(o => o.brand === brandId);
ABRA.getMenuForOutlet = (outletSlug) => {
  const outlet = ABRA.getOutlet(outletSlug);
  if (!outlet) return [];
  return ABRA.menu.filter(m => m.brand === outlet.brand && (m.outlets === "all" || m.outlets.includes(outletSlug)));
};
ABRA.getStatesForCountry = code => (ABRA.locations.find(l => l.code === code) || {}).states || [];
ABRA.getCitiesForState = (countryCode, stateCode) => {
  const st = ABRA.getStatesForCountry(countryCode).find(s => s.code === stateCode);
  return st ? st.cities : [];
};
ABRA.getOutletsForCity = (countryCode, stateCode, cityCode) => {
  const cities = ABRA.getCitiesForState(countryCode, stateCode);
  const city = cities.find(c => c.code === cityCode);
  if (!city) return [];
  return city.outlets.map(slug => ABRA.getOutlet(slug)).filter(Boolean);
};
ABRA.currencyFor = countryCode => (ABRA.locations.find(l => l.code === countryCode) || {}).currency || "₹";
ABRA.fmtPrice = (price, countryCode) => `${ABRA.currencyFor(countryCode || "IN")}${price}`;

/* Find the {country, state, city} code path that contains a given outlet slug —
   lets any page snap the cascading picker straight to an outlet's location. */
ABRA.findLocationCodesForOutlet = (outletSlug) => {
  for (const country of ABRA.locations) {
    for (const state of country.states) {
      for (const city of state.cities) {
        if (city.outlets.includes(outletSlug)) {
          return { country: country.code, state: state.code, city: city.code, outlet: outletSlug };
        }
      }
    }
  }
  return null;
};
