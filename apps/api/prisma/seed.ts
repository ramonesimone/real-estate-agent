/**
 * SEED DATA — Synthetic data for MVP demo / client presentation.
 *
 * HOW TO RUN:   npx tsx prisma/seed.ts
 * HOW TO REMOVE (when going to production SaaS):
 *   1. Delete this file:  rm prisma/seed.ts
 *   2. Remove "prisma:seed" and "db:seed" from scripts in apps/api/package.json
 *
 * All data is synthetic and generated for demonstration purposes only.
 * No real client information is included. US market data.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function daysAgo(d: number): Date {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000)
}

function minsAfter(date: Date, m: number): Date {
  return new Date(date.getTime() + m * 60 * 1000)
}

const AGENTS = [
  { id: 'agent-sarah', name: 'Sarah Mitchell',  phone: '+14155550101', email: 'sarah@premierhomes.com', agency: 'Premier Homes Realty', whatsapp: '14155550101' },
  { id: 'agent-james',  name: 'James Chen',     phone: '+14155550202', email: 'james@premierhomes.com',  agency: 'Premier Homes Realty', whatsapp: '14155550202' },
  { id: 'agent-maya',   name: 'Maya Rodriguez', phone: '+17865550303', email: 'maya@premierhomes.com',   agency: 'Premier Homes Realty', whatsapp: '17865550303' },
  { id: 'agent-keith',  name: 'Keith Turner',   phone: '+13055550404', email: 'keith@premierhomes.com',   agency: 'Premier Homes Realty', whatsapp: '13055550404' },
  { id: 'agent-rachel', name: 'Rachel Park',    phone: '+16175550505', email: 'rachel@premierhomes.com',  agency: 'Premier Homes Realty', whatsapp: '16175550505' },
]

type PropertySeed = {
  id: string; title: string; desc: string; price: number; type: string
  beds: number; baths: number; location: string; area: string; amenities: string[]
  agent: string; status?: string
}

const PROPERTIES: PropertySeed[] = [
  // ── New York City (6) ──
  { id: 'prop-tribeca-loft',    title: 'TriBeCa Loft — 3BR with Hudson River Views',        desc: 'Stunning industrial-chic loft with 14ft ceilings, exposed brick, Viking chef\'s kitchen, and floor-to-ceiling windows overlooking the Hudson. Private rooftop terrace.', price: 4250000, type: 'SALE', beds: 3, baths: 2, location: 'TriBeCa', area: 'Manhattan, NY', amenities: ['Rooftop terrace','Doorman','Gym','Laundry','Storage','Pet friendly'], agent: 'agent-sarah' },
  { id: 'prop-ues',             title: 'Upper East Side Prewar 2BR',                         desc: 'Classic prewar 2-bedroom on a tree-lined UES block. Original hardwood floors, crown moldings, wood-burning fireplace, updated windowed kitchen. Steps from Central Park.', price: 1850000, type: 'SALE', beds: 2, baths: 1, location: 'Upper East Side', area: 'Manhattan, NY', amenities: ['Fireplace','Hardwood floors','Doorman','Bike room'], agent: 'agent-sarah' },
  { id: 'prop-williamsburg',    title: 'Williamsburg 1BR + Den — Rent',                      desc: 'Bright 1BR+den in full-service Williamsburg building. Quartz countertops, in-unit W/D, private balcony with skyline views. Steps from Bedford Ave.', price: 4200, type: 'RENT', beds: 1, baths: 1, location: 'Williamsburg', area: 'Brooklyn, NY', amenities: ['Balcony','In-unit W/D','Gym','Rooftop','Doorman'], agent: 'agent-sarah' },
  { id: 'prop-chelsea',         title: 'Chelsea 2BR — Gallery District',                      desc: 'Sleek 2BR in a Chelsea cond-op with private garden access. White oak floors, Caesarstone kitchen, built-in shelving. Close to the High Line, Chelsea Market, and galleries.', price: 2200000, type: 'SALE', beds: 2, baths: 2, location: 'Chelsea', area: 'Manhattan, NY', amenities: ['Garden access','Bike storage','Cellar','Pet friendly'], agent: 'agent-sarah' },
  { id: 'prop-dumbo',           title: 'DUMBO 1BR — Brooklyn Bridge Park',                    desc: 'Modern 1BR in DUMBO with panoramic Manhattan skyline views. Floor-to-ceiling glass, chef\'s kitchen, rooftop pool, and gym. Steps from Brooklyn Bridge Park and Time Out Market.', price: 5500, type: 'RENT', beds: 1, baths: 1, location: 'DUMBO', area: 'Brooklyn, NY', amenities: ['Rooftop pool','Gym','Doorman','Parking available','Bike storage'], agent: 'agent-sarah' },
  { id: 'prop-astoria',         title: 'Astoria 2BR — Renovated Prewar',                      desc: 'Spacious 2BR in a well-maintained Astoria prewar. Renovated bathroom and kitchen, good closet space, elevator, and roof deck. Blocks from the N/W train and Astoria Park.', price: 2800, type: 'RENT', beds: 2, baths: 1, location: 'Astoria', area: 'Queens, NY', amenities: ['Elevator','Roof deck','Laundry','Pet friendly'], agent: 'agent-sarah' },

  // ── Los Angeles (4) ──
  { id: 'prop-beverly-hills',   title: 'Beverly Hills Mid-Century Modern — 5BR',             desc: 'Iconic mid-century modern estate in the Beverly Hills flats. Floor-to-ceiling glass, zero-edge pool, outdoor kitchen, mature olive trees. Private gated entry.', price: 7800000, type: 'SALE', beds: 5, baths: 5, location: 'Beverly Hills', area: 'Los Angeles, CA', amenities: ['Pool','Outdoor kitchen','Gated','Wine cellar','Home theater','EV charger'], agent: 'agent-james' },
  { id: 'prop-santa-monica',    title: 'Santa Monica 2BR — Steps to Beach',                   desc: 'Renovated 2BR bungalow in Ocean Park. Open floor plan, Bosch appliances, tankless water heater, drought-tolerant landscaping, 2-car garage. Three blocks to the beach.', price: 1495000, type: 'SALE', beds: 2, baths: 2, location: 'Santa Monica', area: 'Los Angeles, CA', amenities: ['Garage 2 cars','Drought-tolerant garden','Bosch appliances','Solar panels'], agent: 'agent-james' },
  { id: 'prop-silverlake',      title: 'Silver Lake Hillside 3BR',                            desc: 'Perched above the Silver Lake Reservoir, this 3BR modern home has walls of glass, a saltwater pool, and a guest house. Jaw-dropping views of the downtown skyline.', price: 2750000, type: 'SALE', beds: 3, baths: 3, location: 'Silver Lake', area: 'Los Angeles, CA', amenities: ['Saltwater pool','Guest house','Deck','City views','EV charger'], agent: 'agent-james' },
  { id: 'prop-venice',          title: 'Venice Beach 2BR — Abbot Kinney',                     desc: 'Charming 2BR house one block from Abbot Kinney Blvd. Open courtyard, outdoor shower, finished garage with studio potential. Walk to the boardwalk, Gjelina, and Erewhon.', price: 1800000, type: 'SALE', beds: 2, baths: 1, location: 'Venice', area: 'Los Angeles, CA', amenities: ['Courtyard','Outdoor shower','Garage','Garden'], agent: 'agent-james' },

  // ── San Francisco (3) ──
  { id: 'prop-pac-heights',     title: 'Pacific Heights Victorian 4BR',                       desc: 'Gorgeous renovated Victorian in prime Pac Heights. 4BR, 3BA, period details: stained glass, ornate fireplace, bay windows. Modern kitchen opens to south-facing garden. Bay views.', price: 3950000, type: 'SALE', beds: 4, baths: 3, location: 'Pacific Heights', area: 'San Francisco, CA', amenities: ['Garden','Parking 1 car','Fireplace','Bay windows','Stained glass'], agent: 'agent-james' },
  { id: 'prop-soma',            title: 'SoMa 1BR — Tech Hub Living',                          desc: 'Sleek 1BR in a new SoMa high-rise. Smart home features, Miele appliances, panoramic bay bridge views. Building has co-working, gym, rooftop lounge, and pet spa.', price: 3800, type: 'RENT', beds: 1, baths: 1, location: 'SoMa', area: 'San Francisco, CA', amenities: ['Co-working','Gym','Rooftop lounge','Pet spa','Parking available'], agent: 'agent-james' },
  { id: 'prop-noe-valley',      title: 'Noe Valley 3BR — Family Home',                        desc: 'Lovely 3BR Edwardian in family-friendly Noe Valley. Updated kitchen and baths, sunny south-facing deck, one-car garage. Top-rated schools. Walk to 24th Street shops.', price: 2850000, type: 'SALE', beds: 3, baths: 2, location: 'Noe Valley', area: 'San Francisco, CA', amenities: ['Deck','Garage','Hardwood floors','Washer/dryer','Close to transit'], agent: 'agent-james' },

  // ── Miami (4) ──
  { id: 'prop-brickell',        title: 'Brickell Luxury 1BR — Bay View',                      desc: 'High-floor 1BR in Brickell\'s best condo tower. Floor-to-ceiling windows, Biscayne Bay views. Resort amenities: pool, spa, tennis, gym, valet. Walk to Brickell City Centre.', price: 3800, type: 'RENT', beds: 1, baths: 1, location: 'Brickell', area: 'Miami, FL', amenities: ['Pool','Spa','Tennis court','Gym','Valet parking','Concierge'], agent: 'agent-maya' },
  { id: 'prop-coral-gables',    title: 'Coral Gables Mediterranean 4BR',                      desc: 'Mediterranean estate in historic Coral Gables. Barrel tile roof, courtyard, saltwater pool, banyan trees. 4BR en-suite, La Cornue range, guest house. Old Florida elegance.', price: 2950000, type: 'SALE', beds: 4, baths: 5, location: 'Coral Gables', area: 'Miami, FL', amenities: ['Pool','Guest house','Wine cellar','Courtyard','La Cornue range'], agent: 'agent-maya' },
  { id: 'prop-mid-beach',       title: 'Mid-Beach 3BR — Oceanfront Condo',                    desc: 'Direct oceanfront 3BR in a Mid-Beach boutique building. Wrap-around terrace, ocean views from every room, marble baths, and a pool overlooking the Atlantic. Recently renovated.', price: 4200000, type: 'SALE', beds: 3, baths: 3, location: 'Mid-Beach', area: 'Miami Beach, FL', amenities: ['Oceanfront','Pool','Terrace','Valet','Concierge','Fitness center'], agent: 'agent-maya' },
  { id: 'prop-wynwood',         title: 'Wynwood 2BR — Arts District Loft',                    desc: 'Live in the heart of the Wynwood Arts District. Converted warehouse 2BR with 16ft ceilings, concrete floors, street-art views. Rooftop deck, gym, and ground-floor gallery space.', price: 5200, type: 'RENT', beds: 2, baths: 2, location: 'Wynwood', area: 'Miami, FL', amenities: ['Rooftop deck','Gym','Gallery space','Bike storage','Pet friendly'], agent: 'agent-maya' },

  // ── Chicago (3) ──
  { id: 'prop-lincoln-park',    title: 'Lincoln Park Brownstone 4BR',                         desc: 'Classic Chicago brownstone in prime Lincoln Park. 4BR, 3.5BA, updated kitchen, coffered ceiling family room, finished basement, 2-car garage. Steps from the park and zoo.', price: 2350000, type: 'SALE', beds: 4, baths: 4, location: 'Lincoln Park', area: 'Chicago, IL', amenities: ['Garage 2 cars','Finished basement','Coffered ceilings','Deck','Wine cellar'], agent: 'agent-keith' },
  { id: 'prop-west-loop',       title: 'West Loop 1BR — Fulton Market',                       desc: 'Industrial-chic 1BR in Chicago\'s hottest neighborhood. Exposed concrete ceilings, polished floors, floor-to-ceiling windows. Rooftop pool, gym, co-working, dog run.', price: 2600, type: 'RENT', beds: 1, baths: 1, location: 'West Loop', area: 'Chicago, IL', amenities: ['Rooftop pool','Gym','Co-working','Dog run','Bike storage'], agent: 'agent-keith' },
  { id: 'prop-gold-coast',      title: 'Gold Coast Studio — Lake Views',                      desc: 'Elegant studio in a full-service Gold Coast high-rise. Lake Michigan views, newly renovated kitchen and bath, doorman, gym, and rooftop sundeck. Perfect pied-à-terre.', price: 1800, type: 'RENT', beds: 0, baths: 1, location: 'Gold Coast', area: 'Chicago, IL', amenities: ['Doorman','Gym','Rooftop sundeck','Lake views','Laundry'], agent: 'agent-keith' },

  // ── Austin (3) ──
  { id: 'prop-south-congress',  title: 'South Congress Modern 3BR',                           desc: 'Contemporary 3BR off South Congress. Open-plan, floor-to-ceiling glass, waterfall island kitchen. Heated pool, turf yard, covered patio with outdoor TV. Walk to Jo\'s Coffee.', price: 1895000, type: 'SALE', beds: 3, baths: 2, location: 'South Congress', area: 'Austin, TX', amenities: ['Heated pool','Outdoor TV','Covered patio','EV charger','Smart home'], agent: 'agent-keith' },
  { id: 'prop-east-austin',     title: 'East Austin 2BR — Modern Farmhouse',                  desc: 'New-build modern farmhouse in the rapidly growing East Austin. 2BR, 2BA, covered front porch, fenced backyard, detached office/studio. Walking distance to Ramen Tatsu-ya and Suerte.', price: 875000, type: 'SALE', beds: 2, baths: 2, location: 'East Austin', area: 'Austin, TX', amenities: ['Office/studio','Covered porch','Fenced yard','Tankless water heater','Solar'], agent: 'agent-keith' },
  { id: 'prop-zilker',          title: 'Zilker 4BR — Pool & Guest House',                     desc: 'Stunning 4BR near Zilker Park with a heated pool, guest house, and mature oak trees. Open-concept living, German-engineered kitchen, and a massive screened porch. Short walk to Barton Springs.', price: 3200000, type: 'SALE', beds: 4, baths: 4, location: 'Zilker', area: 'Austin, TX', amenities: ['Heated pool','Guest house','Screened porch','Outdoor kitchen','EV charger'], agent: 'agent-keith' },

  // ── Seattle (2) ──
  { id: 'prop-capitol-hill',    title: 'Capitol Hill 2BR — Lake Union Views',                  desc: 'Sleek 2BR condo on Capitol Hill with views of Lake Union and the Space Needle. Walnut floors, Miele appliances, 300sqft wraparound deck. Secure parking and bike storage.', price: 925000, type: 'SALE', beds: 2, baths: 2, location: 'Capitol Hill', area: 'Seattle, WA', amenities: ['Deck','Parking','Bike storage','Miele appliances','Rooftop deck'], agent: 'agent-rachel' },
  { id: 'prop-ballard',         title: 'Ballard 3BR — Modern Townhome',                        desc: 'Brand-new 3BR townhome in Ballard with rooftop deck, 2-car garage, and mountain views. Quartz countertops, hardwood floors, finished basement. Walk to Ballard Locks and breweries.', price: 1200000, type: 'SALE', beds: 3, baths: 3, location: 'Ballard', area: 'Seattle, WA', amenities: ['Rooftop deck','Garage 2 cars','Finished basement','Mountain views','Smart home'], agent: 'agent-rachel' },

  // ── Denver (2) ──
  { id: 'prop-rino',            title: 'RiNo 1BR — Arts District',                             desc: 'Modern 1BR in Denver\'s River North Art District. Polished concrete floors, exposed ductwork, floor-to-ceiling windows. Building has a gallery, coffee shop, rooftop bar, and fitness center.', price: 2200, type: 'RENT', beds: 1, baths: 1, location: 'RiNo', area: 'Denver, CO', amenities: ['Rooftop bar','Gym','Gallery','Coffee shop','Bike storage'], agent: 'agent-rachel' },
  { id: 'prop-cherry-creek',    title: 'Cherry Creek 3BR — Luxury Condo',                      desc: 'Luxury 3BR in the heart of Cherry Creek. Chef\'s kitchen, spa-like master bath, private terrace. Building concierge, pool, and club room. Steps from the mall and restaurants.', price: 1650000, type: 'SALE', beds: 3, baths: 3, location: 'Cherry Creek', area: 'Denver, CO', amenities: ['Concierge','Pool','Club room','Terrace','Parking 2 cars'], agent: 'agent-rachel' },

  // ── Nashville (2) ──
  { id: 'prop-germantown',      title: 'Germantown 2BR — Historic District',                   desc: 'Beautifully restored 2BR in a historic Germantown building. Exposed brick, original heart pine floors, modern kitchen, and a private courtyard. Walk to farmers market, restaurants, and the stadium.', price: 725000, type: 'SALE', beds: 2, baths: 2, location: 'Germantown', area: 'Nashville, TN', amenities: ['Courtyard','Original hardwoods','Exposed brick','Storage'], agent: 'agent-rachel' },
  { id: 'prop-12-south',        title: '12 South 4BR — Modern Home',                           desc: 'Sleek 4BR in Nashville\'s hottest neighborhood. Open concept, chef\'s kitchen, screened porch, saltwater pool, and detached garage with ADU. Walk to biscuit love, Sevier Park, and Draper James.', price: 2450000, type: 'SALE', beds: 4, baths: 3, location: '12 South', area: 'Nashville, TN', amenities: ['Saltwater pool','ADU','Screened porch','Garage','Smart home'], agent: 'agent-rachel' },

  // ── Washington DC (2) ──
  { id: 'prop-dupont',          title: 'Dupont Circle 1BR — Historic Building',                desc: 'Charming 1BR in a historic Dupont Circle brownstone. High ceilings, original fireplace, bay window, updated kitchen. Walk to the Phillips Collection, Kramerbooks, and metro.', price: 2400, type: 'RENT', beds: 1, baths: 1, location: 'Dupont Circle', area: 'Washington, DC', amenities: ['Fireplace','High ceilings','Bay window','Laundry','Pet friendly'], agent: 'agent-rachel' },
  { id: 'prop-navy-yard',       title: 'Navy Yard 2BR — Ballpark Views',                       desc: 'New 2BR in Navy Yard with views of Nationals Park. Stainless appliances, quartz counters, wide-plank floors. Building has a pool, gym, rooftop terrace, and dog park. Steps from the metro.', price: 3200, type: 'RENT', beds: 2, baths: 2, location: 'Navy Yard', area: 'Washington, DC', amenities: ['Pool','Gym','Rooftop terrace','Dog park','Bike storage','Parking'], agent: 'agent-rachel' },

  // ── Atlanta (2) ──
  { id: 'prop-buckhead',        title: 'Buckhead 4BR — Estate with Pool',                      desc: 'Grand 4BR estate on a private cul-de-sac in Buckhead. Two-story foyer, formal living and dining, renovated kitchen, finished terrace level, saltwater pool, and 3-car garage.', price: 2850000, type: 'SALE', beds: 4, baths: 5, location: 'Buckhead', area: 'Atlanta, GA', amenities: ['Saltwater pool','Terrace level','Garage 3 cars','Wine cellar','Home theater'], agent: 'agent-maya' },
  { id: 'prop-belmont-hills',   title: 'Belmont Hills 3BR — Bungalow',                         desc: 'Renovated craftsman bungalow in the BeltLine-adjacent Belmont Hills. 3BR, 2BA, wraparound porch, finished basement, detached studio. Walk to the Lee + White food hall and Monday Night Brewing.', price: 895000, type: 'SALE', beds: 3, baths: 2, location: 'Belmont Hills', area: 'Atlanta, GA', amenities: ['Wraparound porch','Detached studio','Finished basement','BeltLine access'], agent: 'agent-maya' },

  // ── San Diego (2) ──
  { id: 'prop-little-italy',    title: 'Little Italy 2BR — Waterfront',                        desc: 'Sophisticated 2BR in Little Italy with bay and marina views. Floor-to-ceiling glass, Italian marble baths, custom kitchen. Building amenities: pool, spa, club room, 24/7 concierge.', price: 4500, type: 'RENT', beds: 2, baths: 2, location: 'Little Italy', area: 'San Diego, CA', amenities: ['Pool','Spa','Concierge','Club room','Bay views','Parking'], agent: 'agent-james' },
  { id: 'prop-encinitas',       title: 'Encinitas 3BR — Surf Cottage',                         desc: 'Beach-chic 3BR cottage one block from Moonlight Beach. Open layout, outdoor shower, surfboard storage, fire pit, and drought-tolerant garden. 5-minute bike ride to downtown Encinitas.', price: 2100000, type: 'SALE', beds: 3, baths: 2, location: 'Encinitas', area: 'San Diego, CA', amenities: ['Outdoor shower','Fire pit','Garden','Garage','Surfboard storage'], agent: 'agent-james' },

  // ── Portland (2) ──
  { id: 'prop-alberta',         title: 'Alberta Arts 3BR — Craftsman',                         desc: 'Beautifully restored 3BR craftsman on Alberta Street. Original woodwork, built-ins, tile fireplace, updated systems. Deep lot with raised garden beds, chicken coop, and detached shop.', price: 825000, type: 'SALE', beds: 3, baths: 2, location: 'Alberta Arts', area: 'Portland, OR', amenities: ['Garden','Chicken coop','Detached shop','Fireplace','Covered porch'], agent: 'agent-rachel' },
  { id: 'prop-pearl',           title: 'Pearl District 1BR — Loft Living',                     desc: 'True warehouse loft in the Pearl District. 14ft ceilings, exposed brick, massive timber columns. In-unit W/D, gym, rooftop deck with mountain views. Walk to Powell\'s and the streetcar.', price: 2100, type: 'RENT', beds: 1, baths: 1, location: 'Pearl District', area: 'Portland, OR', amenities: ['Rooftop deck','Gym','Bike storage','In-unit W/D','Storage'], agent: 'agent-rachel' },
]

type LeadSeed = {
  id: string; name: string; phone: string; email: string; source: string
  status: string; score: number; intent: string | null
  budget_min: number | null; budget_max: number | null
  timeline: string | null; location_pref: string | null; bedrooms: number | null
  agent: string | null; created?: Date
}

const LEADS: LeadSeed[] = [
  // ── HOT leads (score >= 80) — 8 ──
  { id: 'lead-michael',  name: 'Michael Torres',   phone: '+19175550101', email: 'michael.torres@gmail.com',     source: 'WEBSITE',  status: 'HOT', score: 85, intent: 'BUY',    budget_min: 3000000,  budget_max: 5000000,  timeline: 'IMMEDIATE',   location_pref: 'TriBeCa / SoHo',      bedrooms: 3,  agent: 'agent-sarah', created: daysAgo(7) },
  { id: 'lead-jessica',  name: 'Jessica Wang',     phone: '+13105550202', email: 'jessica.wang@icloud.com',      source: 'REFERRAL', status: 'HOT', score: 92, intent: 'BUY',    budget_min: 6000000,  budget_max: 10000000, timeline: 'IMMEDIATE',   location_pref: 'Beverly Hills / Bel Air', bedrooms: 5,  agent: 'agent-james', created: daysAgo(3) },
  { id: 'lead-marcus',   name: 'Marcus Williams',  phone: '+14155551010', email: 'marcus.williams@tech.io',     source: 'WEBSITE',  status: 'HOT', score: 88, intent: 'BUY',    budget_min: 3000000,  budget_max: 5000000,  timeline: 'IMMEDIATE',   location_pref: 'Pacific Heights / Marina', bedrooms: 4,  agent: 'agent-james', created: daysAgo(1) },
  { id: 'lead-stephanie', name: 'Stephanie Kim',   phone: '+13105550606', email: 'stephanie.kim@gmail.com',      source: 'REFERRAL', status: 'HOT', score: 90, intent: 'BUY',    budget_min: 1500000,  budget_max: 2200000,  timeline: 'IMMEDIATE',   location_pref: 'Chelsea / West Village', bedrooms: 2,  agent: 'agent-sarah', created: daysAgo(2) },
  { id: 'lead-henry',    name: 'Henry Okafor',     phone: '+17705550707', email: 'henry.okafo@gmail.com',        source: 'WEBSITE',  status: 'HOT', score: 83, intent: 'BUY',    budget_min: 2500000,  budget_max: 3500000,  timeline: 'IMMEDIATE',   location_pref: 'Lincoln Park / Lakeview', bedrooms: 4,  agent: 'agent-keith', created: daysAgo(4) },
  { id: 'lead-lauren',   name: 'Lauren Chen',      phone: '+16175550808', email: 'lauren.chen@outlook.com',     source: 'WHATSAPP', status: 'HOT', score: 87, intent: 'BUY',    budget_min: 3500000,  budget_max: 5000000,  timeline: '1_3_MONTHS', location_pref: 'Coral Gables / Coconut Grove', bedrooms: 4,  agent: 'agent-maya', created: daysAgo(5) },
  { id: 'lead-trevor',   name: 'Trevor Campbell',  phone: '+15125550909', email: 'trevor.c@gmail.com',          source: 'REFERRAL', status: 'HOT', score: 81, intent: 'BUY',    budget_min: 1500000,  budget_max: 2000000,  timeline: 'IMMEDIATE',   location_pref: 'South Congress / Zilker', bedrooms: 3,  agent: 'agent-keith', created: daysAgo(6) },
  { id: 'lead-nina',     name: 'Nina Patel',       phone: '+12065551010', email: 'nina.patel@icloud.com',        source: 'WEBSITE',  status: 'HOT', score: 84, intent: 'RENT',    budget_min: 4000,     budget_max: 6000,     timeline: 'IMMEDIATE',   location_pref: 'DUMBO / Brooklyn Heights', bedrooms: 1,  agent: 'agent-sarah', created: daysAgo(3) },

  // ── QUALIFIED leads (score 50-79) — 10 ──
  { id: 'lead-david',    name: 'David Patel',      phone: '+13055550303', email: 'david.patel@outlook.com',      source: 'WHATSAPP', status: 'QUALIFIED', score: 65, intent: 'RENT',  budget_min: 3000,    budget_max: 4500,     timeline: '1_3_MONTHS', location_pref: 'Brickell / Downtown Miami', bedrooms: 1,  agent: 'agent-maya', created: daysAgo(14) },
  { id: 'lead-emily',    name: 'Emily Park',       phone: '+13475550909', email: 'emily.park@gmail.com',         source: 'WHATSAPP', status: 'QUALIFIED', score: 75, intent: 'RENT',  budget_min: 3500,    budget_max: 5000,     timeline: '1_3_MONTHS', location_pref: 'Williamsburg / Greenpoint', bedrooms: 2,  agent: 'agent-sarah', created: daysAgo(5) },
  { id: 'lead-ryan',     name: 'Ryan Murphy',      phone: '+16175551111', email: 'ryan.murphy@gmail.com',        source: 'WEBSITE',  status: 'QUALIFIED', score: 70, intent: 'BUY',   budget_min: 800000,   budget_max: 1100000,  timeline: '3_6_MONTHS', location_pref: 'East Austin / Crestview', bedrooms: 2,  agent: 'agent-keith', created: daysAgo(10) },
  { id: 'lead-priya',    name: 'Priya Sharma',     phone: '+14155551212', email: 'priya.sharma@proton.me',       source: 'WEBSITE',  status: 'QUALIFIED', score: 68, intent: 'RENT',  budget_min: 2200,    budget_max: 3000,     timeline: '1_3_MONTHS', location_pref: 'Capitol Hill / Ballard', bedrooms: 1,  agent: 'agent-rachel', created: daysAgo(8) },
  { id: 'lead-jordan',   name: 'Jordan Foster',    phone: '+13045551313', email: 'jordan.foster@outlook.com',    source: 'WHATSAPP', status: 'QUALIFIED', score: 72, intent: 'BUY',   budget_min: 1500000,  budget_max: 2200000,  timeline: '1_3_MONTHS', location_pref: 'Cherry Creek / Wash Park', bedrooms: 3,  agent: 'agent-rachel', created: daysAgo(12) },
  { id: 'lead-isabella', name: 'Isabella Costa',   phone: '+17865551414', email: 'isabella.costa@gmail.com',     source: 'REFERRAL', status: 'QUALIFIED', score: 60, intent: 'RENT',  budget_min: 2800,    budget_max: 4000,     timeline: '3_6_MONTHS', location_pref: 'SoMa / Mission', bedrooms: 2,  agent: 'agent-james', created: daysAgo(20) },
  { id: 'lead-daniel',   name: 'Daniel Nguyen',    phone: '+12025551515', email: 'daniel.nguyen@hotmail.com',    source: 'WHATSAPP', status: 'QUALIFIED', score: 55, intent: 'BUY',   budget_min: 700000,   budget_max: 950000,   timeline: '3_6_MONTHS', location_pref: 'Germantown / The Nations', bedrooms: 2,  agent: 'agent-rachel', created: daysAgo(15) },
  { id: 'lead-olivia',   name: 'Olivia Brown',     phone: '+14045551616', email: 'olivia.brown@gmail.com',       source: 'WEBSITE',  status: 'QUALIFIED', score: 62, intent: 'SELL',  budget_min: null,     budget_max: null,     timeline: '1_3_MONTHS', location_pref: 'Buckhead / Midtown', bedrooms: 3,  agent: 'agent-maya', created: daysAgo(9) },
  { id: 'lead-liam',     name: 'Liam Gallagher',   phone: '+16175551717', email: 'liam.gallagher@proton.me',     source: 'REFERRAL', status: 'QUALIFIED', score: 58, intent: 'INVEST', budget_min: 500000,   budget_max: 1000000,  timeline: '6_PLUS',     location_pref: 'Nashville / Charlotte', bedrooms: null, agent: 'agent-rachel', created: daysAgo(25) },
  { id: 'lead-sophia',   name: 'Sophia Martinez',  phone: '+12125551818', email: 'sophia.mtz@gmail.com',         source: 'OPEN_HOUSE', status: 'QUALIFIED', score: 67, intent: 'BUY', budget_min: 1800000, budget_max: 2500000, timeline: '1_3_MONTHS', location_pref: 'Upper East Side / Upper West Side', bedrooms: 2, agent: 'agent-sarah', created: daysAgo(11) },

  // ── CONTACTED leads — 6 ──
  { id: 'lead-maria',    name: 'Maria Garcia',     phone: '+14155550606', email: 'maria.garcia@hotmail.com',     source: 'WHATSAPP', status: 'CONTACTED', score: 15, intent: 'RENT',  budget_min: null,    budget_max: 5500,     timeline: null,        location_pref: 'Brooklyn / Williamsburg', bedrooms: 2,  agent: null, created: daysAgo(2) },
  { id: 'lead-connor',   name: 'Connor Sullivan',  phone: '+18575551919', email: 'connor.sullivan@gmail.com',    source: 'WEBSITE',  status: 'CONTACTED', score: 10, intent: 'BUY',   budget_min: null,    budget_max: null,     timeline: null,        location_pref: 'Denver / Boulder', bedrooms: null, agent: null, created: daysAgo(1) },
  { id: 'lead-ava',      name: 'Ava Johnson',      phone: '+13105552020', email: 'ava.johnson@icloud.com',       source: 'WHATSAPP', status: 'CONTACTED', score: 20, intent: 'RENT',  budget_min: 2500,    budget_max: 3500,     timeline: null,        location_pref: 'Silver Lake / Echo Park', bedrooms: 1,  agent: 'agent-james', created: daysAgo(3) },
  { id: 'lead-ethan',    name: 'Ethan Wright',     phone: '+16175552121', email: 'ethan.wright@outlook.com',     source: 'WEBSITE',  status: 'CONTACTED', score: 5,  intent: null,    budget_min: null,    budget_max: null,     timeline: null,        location_pref: null,                 bedrooms: null, agent: null, created: daysAgo(1) },
  { id: 'lead-mia',      name: 'Mia Thompson',     phone: '+12125552222', email: 'mia.thompson@gmail.com',       source: 'OPEN_HOUSE', status: 'CONTACTED', score: 12, intent: 'RENT', budget_min: 3000,   budget_max: 4500,     timeline: null,        location_pref: 'Astoria / Long Island City', bedrooms: 1,  agent: null, created: daysAgo(4) },
  { id: 'lead-lucas',    name: 'Lucas Anders',     phone: '+13105552323', email: 'lucas.anders@gmail.com',       source: 'WHATSAPP', status: 'CONTACTED', score: 18, intent: null,   budget_min: null,    budget_max: 800000,   timeline: null,        location_pref: 'Venice / Santa Monica', bedrooms: 2,  agent: null, created: daysAgo(2) },

  // ── NEW leads — 5 ──
  { id: 'lead-thomas',   name: 'Thomas Baker',     phone: '+16175550505', email: 'thomas.baker@proton.me',       source: 'WEBSITE',   status: 'NEW', score: 0,  intent: null,  budget_min: null,    budget_max: null,     timeline: null, location_pref: null, bedrooms: null, agent: null, created: daysAgo(0) },
  { id: 'lead-hannah',   name: 'Hannah Lee',       phone: '+14155552424', email: 'hannah.lee@gmail.com',         source: 'WEBSITE',   status: 'NEW', score: 0,  intent: null,  budget_min: null,    budget_max: null,     timeline: null, location_pref: null, bedrooms: null, agent: null, created: daysAgo(0) },
  { id: 'lead-noah',     name: 'Noah Williams',    phone: '+13105552525', email: 'noah.williams@outlook.com',    source: 'WHATSAPP',  status: 'NEW', score: 0,  intent: null,  budget_min: null,    budget_max: null,     timeline: null, location_pref: null, bedrooms: null, agent: null, created: daysAgo(0) },
  { id: 'lead-zoe',      name: 'Zoe Brooks',       phone: '+16175552626', email: 'zoe.brooks@icloud.com',        source: 'REFERRAL',  status: 'NEW', score: 0,  intent: null,  budget_min: null,    budget_max: null,     timeline: null, location_pref: null, bedrooms: null, agent: null, created: daysAgo(0) },
  { id: 'lead-elijah',   name: 'Elijah Scott',     phone: '+13055552727', email: 'elijah.scott@gmail.com',       source: 'WEBSITE',   status: 'NEW', score: 0,  intent: null,  budget_min: null,    budget_max: null,     timeline: null, location_pref: null, bedrooms: null, agent: null, created: daysAgo(0) },

  // ── COLD leads (score < 50) — 8 ──
  { id: 'lead-rachel',   name: 'Rachel Green',     phone: '+14155550404', email: 'rachel.green@gmail.com',       source: 'WEBSITE',    status: 'COLD', score: 30, intent: 'INVEST', budget_min: null,    budget_max: null,     timeline: '6_PLUS',     location_pref: 'Austin / Nashville', bedrooms: null, agent: null, created: daysAgo(90) },
  { id: 'lead-kevin',    name: "Kevin O'Brien",    phone: '+12125550808', email: 'kevin.obrien@yahoo.com',       source: 'OPEN_HOUSE', status: 'COLD', score: 20, intent: null,    budget_min: null,    budget_max: null,     timeline: null,        location_pref: null,                     bedrooms: null, agent: null, created: daysAgo(45) },
  { id: 'lead-sam',      name: 'Samir Gupta',      phone: '+14045552828', email: 'samir.gupta@outlook.com',      source: 'WEBSITE',    status: 'COLD', score: 35, intent: 'BUY',    budget_min: null,    budget_max: 1200000,  timeline: '6_PLUS',     location_pref: 'Atlanta / Alpharetta',  bedrooms: 3,  agent: null, created: daysAgo(60) },
  { id: 'lead-chloe',    name: 'Chloe Anderson',   phone: '+16175552929', email: 'chloe.anderson@gmail.com',     source: 'WHATSAPP',   status: 'COLD', score: 15, intent: null,    budget_min: null,    budget_max: null,     timeline: null,        location_pref: 'Seattle / Redmond',     bedrooms: null, agent: null, created: daysAgo(30) },
  { id: 'lead-jason',    name: 'Jason Park',       phone: '+13105553030', email: 'jason.park@proton.me',         source: 'WEBSITE',    status: 'COLD', score: 25, intent: 'RENT',   budget_min: null,    budget_max: null,     timeline: null,        location_pref: 'Koreatown / DTLA',      bedrooms: 1,  agent: null, created: daysAgo(50) },
  { id: 'lead-grace',    name: 'Grace Nguyen',     phone: '+12125553131', email: 'grace.nguyen@hotmail.com',     source: 'REFERRAL',   status: 'COLD', score: 40, intent: 'BUY',    budget_min: 2000000, budget_max: 3000000,  timeline: '6_PLUS',     location_pref: 'Pacific Palisades / Santa Monica', bedrooms: 3, agent: null, created: daysAgo(70) },
  { id: 'lead-taylor',   name: 'Taylor Reed',      phone: '+15125553232', email: 'taylor.reed@gmail.com',        source: 'OPEN_HOUSE', status: 'COLD', score: 10, intent: null,    budget_min: null,    budget_max: null,     timeline: null,        location_pref: null,                     bedrooms: null, agent: null, created: daysAgo(35) },
  { id: 'lead-lily',     name: 'Lily Chang',       phone: '+16175553333', email: 'lily.chang@icloud.com',        source: 'WEBSITE',    status: 'COLD', score: 28, intent: 'INVEST', budget_min: 300000,  budget_max: 600000,   timeline: '3_6_MONTHS', location_pref: 'Portland / Bend',       bedrooms: null, agent: null, created: daysAgo(80) },

  // ── CONVERTED leads — 3 ──
  { id: 'lead-alex',     name: 'Alex Reynolds',    phone: '+17735550707', email: 'alex.reynolds@gmail.com',      source: 'REFERRAL', status: 'CONVERTED', score: 95, intent: 'BUY',  budget_min: 1800000, budget_max: 2500000, timeline: '1_3_MONTHS', location_pref: 'Lincoln Park / Lakeview', bedrooms: 3, agent: 'agent-keith', created: daysAgo(60) },
  { id: 'lead-sandra',   name: 'Sandra Blake',     phone: '+12125553434', email: 'sandra.blake@gmail.com',       source: 'WEBSITE',  status: 'CONVERTED', score: 92, intent: 'BUY',  budget_min: 3500000, budget_max: 4500000, timeline: '1_3_MONTHS', location_pref: 'Mid-Beach / South Beach',  bedrooms: 3, agent: 'agent-maya', created: daysAgo(45) },
  { id: 'lead-victor',   name: 'Victor Tran',      phone: '+14155553535', email: 'victor.tran@outlook.com',      source: 'REFERRAL', status: 'CONVERTED', score: 90, intent: 'BUY',  budget_min: 900000,  budget_max: 1300000, timeline: '3_6_MONTHS', location_pref: 'Capitol Hill / Ballard',   bedrooms: 3, agent: 'agent-rachel', created: daysAgo(90) },
]

async function main() {
  console.log('🌱 Seeding synthetic data for Real Estate AI Agent demo (US market)...')

  await prisma.nurtureSequence.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.property.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.agent.deleteMany()

  // ── Agents ────────────────────────────────────────────────────────
  for (const a of AGENTS) {
    await prisma.agent.create({
      data: {
        id: a.id,
        name: a.name,
        phone: a.phone,
        email: a.email,
        agency: a.agency,
        whatsapp_id: a.whatsapp,
      },
    })
  }
  console.log(`  ✓ Created ${AGENTS.length} agents`)

  // ── Properties ────────────────────────────────────────────────────
  for (const p of PROPERTIES) {
    await prisma.property.create({
      data: {
        id: p.id,
        title: p.title,
        description: p.desc,
        price: p.price,
        type: p.type,
        bedrooms: p.beds,
        bathrooms: p.baths,
        location: p.location,
        area: p.area,
        amenities: JSON.stringify(p.amenities),
        images: JSON.stringify(['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9']),
        status: p.status ?? 'AVAILABLE',
        agent_id: p.agent,
      },
    })
  }
  console.log(`  ✓ Created ${PROPERTIES.length} properties across US markets`)

  // ── Leads ─────────────────────────────────────────────────────────
  for (const l of LEADS) {
    await prisma.lead.create({
      data: {
        id: l.id,
        phone: l.phone,
        name: l.name,
        email: l.email,
        source: l.source as any,
        status: l.status as any,
        score: l.score,
        intent: l.intent,
        budget_min: l.budget_min,
        budget_max: l.budget_max,
        timeline: l.timeline,
        location_pref: l.location_pref,
        bedrooms: l.bedrooms,
        agent_id: l.agent,
        created_at: l.created ?? new Date(),
      },
    })
  }
  const hotCount = LEADS.filter(l => l.status === 'HOT').length
  const qualifiedCount = LEADS.filter(l => l.status === 'QUALIFIED').length
  const coldCount = LEADS.filter(l => l.status === 'COLD').length
  const convertedCount = LEADS.filter(l => l.status === 'CONVERTED').length
  console.log(`  ✓ Created ${LEADS.length} leads: ${hotCount} HOT, ${qualifiedCount} QUALIFIED, ${coldCount} COLD, ${convertedCount} CONVERTED, plus CONTACTED and NEW`)

  // ── Conversations ─────────────────────────────────────────────────
  const conversations: Array<{ lead_id: string; channel: string; direction: string; message: string; timestamp: Date }> = [
    // === Michael Torres (HOT, TriBeCa) ===
    { lead_id: 'lead-michael', channel: 'WEBSITE', direction: 'INBOUND', message: 'Hi, I\'m looking for a 3-bedroom loft or condo in TriBeCa or SoHo. Need to move ASAP — my lease ends in 6 weeks.', timestamp: daysAgo(7) },
    { lead_id: 'lead-michael', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Michael! Thanks for reaching out. We have some incredible 3-bedroom options in TriBeCa right now. Are you looking to buy or rent?', timestamp: minsAfter(daysAgo(7), 1) },
    { lead_id: 'lead-michael', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Buy. Budget is between $3M and $5M. I work in finance and want to be walking distance to the office downtown.', timestamp: minsAfter(daysAgo(7), 90) },
    { lead_id: 'lead-michael', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Great news — we just listed a stunning 3BR loft in TriBeCa with Hudson River views, right in your range. Are you free this weekend to see it?', timestamp: minsAfter(daysAgo(7), 95) },
    { lead_id: 'lead-michael', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Saturday morning works. I\'m currently in Murray Hill but ready to move downtown.', timestamp: daysAgo(6) },
    { lead_id: 'lead-michael', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Perfect! I\'ll send you the address and lockbox code. See you Saturday at 10am!', timestamp: minsAfter(daysAgo(6), 5) },

    // === Jessica Wang (HOT, Beverly Hills) ===
    { lead_id: 'lead-jessica', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Hello, we were referred by the Goldmans — they said you found them their Holmby Hills home. Looking for 5BR in Beverly Hills or Bel Air. Budget flexible up to $10M.', timestamp: daysAgo(3) },
    { lead_id: 'lead-jessica', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Jessica! The Goldmans are wonderful clients. We have an exceptional mid-century modern estate in Beverly Hills — 5BR, pool, gated. Are you looking to move quickly?', timestamp: minsAfter(daysAgo(3), 30) },
    { lead_id: 'lead-jessica', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Yes, immediate. We\'re relocating from Singapore next month. Send details and let\'s do a FaceTime walkthrough.', timestamp: minsAfter(daysAgo(3), 150) },

    // === Marcus Williams (HOT, Pacific Heights) ===
    { lead_id: 'lead-marcus', channel: 'WEBSITE', direction: 'INBOUND', message: 'Relocating to SF for a tech role. Need a 4-bedroom in Pacific Heights or the Marina. Budget $3M-$5M. Need to close within 45 days.', timestamp: daysAgo(1) },
    { lead_id: 'lead-marcus', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Marcus, welcome to SF! We have a stunning 4BR Victorian in Pac Heights — bay views, renovated, parking. I can do a video walkthrough today.', timestamp: minsAfter(daysAgo(1), 2) },
    { lead_id: 'lead-marcus', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Send it over. I want to move fast on this. Need to be settled before my start date.', timestamp: minsAfter(daysAgo(1), 60) },

    // === Stephanie Kim (HOT, Chelsea) ===
    { lead_id: 'lead-stephanie', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Hi! I was referred by a friend. Looking for a 2-bedroom in Chelsea or the West Village. Budget around $1.5M to $2.2M. I want to close within 60 days.', timestamp: daysAgo(2) },
    { lead_id: 'lead-stephanie', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Stephanie! Great to hear from you. We have a lovely 2BR in Chelsea with garden access right in your range. Are you free to view it this week?', timestamp: minsAfter(daysAgo(2), 15) },
    { lead_id: 'lead-stephanie', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Yes, Thursday after 5pm works perfectly.', timestamp: minsAfter(daysAgo(2), 120) },

    // === Henry Okafor (HOT, Lincoln Park) ===
    { lead_id: 'lead-henry', channel: 'WEBSITE', direction: 'INBOUND', message: 'Looking for a 4-bedroom brownstone in Lincoln Park or Lakeview. Budget $2.5M to $3.5M. Need to move before school starts in the fall.', timestamp: daysAgo(4) },
    { lead_id: 'lead-henry', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Henry! Great news — we have a classic 4BR Lincoln Park brownstone with a 2-car garage and finished basement. It\'s $2.35M and move-in ready. Would you like to see it?', timestamp: minsAfter(daysAgo(4), 20) },
    { lead_id: 'lead-henry', channel: 'WHATSAPP', direction: 'INBOUND', message: 'That sounds promising. Can you send me the full listing? My wife and I can come by this weekend.', timestamp: minsAfter(daysAgo(4), 180) },

    // === Lauren Chen (HOT, Coral Gables) ===
    { lead_id: 'lead-lauren', channel: 'WHATSAPP', direction: 'INBOUND', message: 'We\'re moving to Miami from Chicago and want a 4-bedroom in Coral Gables or Coconut Grove. Budget $3.5M-$5M. Looking within the next few months.', timestamp: daysAgo(5) },
    { lead_id: 'lead-lauren', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Welcome, Lauren! You\'ll love Miami. We have a stunning Mediterranean estate in Coral Gables — 4BR, guest house, saltwater pool. Right at $2.95M, well under budget. Want to see it?', timestamp: minsAfter(daysAgo(5), 10) },

    // === Trevor Campbell (HOT, Austin) ===
    { lead_id: 'lead-trevor', channel: 'WHATSAPP', direction: 'INBOUND', message: 'My brother bought through you last year. I need a 3-bedroom modern home in South Congress or Zilker. Budget $1.5M to $2M. Ready to buy now.', timestamp: daysAgo(6) },
    { lead_id: 'lead-trevor', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Trevor! Great to have a referral. We\'ve got a stunning 3BR modern on South Congress with a heated pool and smart home features at $1.895M. Want to take a look?', timestamp: minsAfter(daysAgo(6), 5) },

    // === Nina Patel (HOT, DUMBO) ===
    { lead_id: 'lead-nina', channel: 'WEBSITE', direction: 'INBOUND', message: 'Looking for a luxury 1-bedroom rental in DUMBO or Brooklyn Heights. Budget $4k-$6k. Need to move in 2 weeks — my current lease is ending.', timestamp: daysAgo(3) },
    { lead_id: 'lead-nina', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Nina! We have a gorgeous 1BR in DUMBO with panoramic Manhattan views — $5,500/mo and available immediately. Would you like to schedule a tour?', timestamp: minsAfter(daysAgo(3), 8) },
    { lead_id: 'lead-nina', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Yes please! I can come by tomorrow after work. Does 6pm work?', timestamp: minsAfter(daysAgo(3), 60) },

    // === David Patel (QUALIFIED, Miami) ===
    { lead_id: 'lead-david', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Hey, moving to Miami for a new job. Need a 1-bedroom in Brickell or downtown. Budget $3k to $4.5k.', timestamp: daysAgo(14) },
    { lead_id: 'lead-david', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi David! Welcome to Miami — you\'re going to love it. We have some great 1BR options in Brickell with bay views. When are you planning to move?', timestamp: minsAfter(daysAgo(14), 10) },
    { lead_id: 'lead-david', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Start date is in 2 months so I have some time. Ideally within 1 to 3 months.', timestamp: daysAgo(13) },

    // === Emily Park (QUALIFIED, Brooklyn) ===
    { lead_id: 'lead-emily', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Hello! I need a 2-bedroom in Williamsburg or Greenpoint. Budget $3,500 to $5,000 per month.', timestamp: daysAgo(5) },
    { lead_id: 'lead-emily', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Emily! Great budget for Williamsburg. We have a lovely 2BR with a balcony and in-unit W/D. When are you looking to move?', timestamp: minsAfter(daysAgo(5), 1) },
    { lead_id: 'lead-emily', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Within the next 1 to 3 months. My current lease is month-to-month so I have flexibility.', timestamp: daysAgo(4) },

    // === Ryan Murphy (QUALIFIED, Austin) ===
    { lead_id: 'lead-ryan', channel: 'WEBSITE', direction: 'INBOUND', message: 'Looking to buy my first home in Austin. Pre-approved up to $1.1M. Interested in East Austin or Crestview. I work in tech and want something modern.', timestamp: daysAgo(10) },
    { lead_id: 'lead-ryan', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Congrats on the pre-approval Ryan! We have a beautiful 2BR modern farmhouse in East Austin at $875K — well under your max. Has an ADU too if you want rental income. Want to see it?', timestamp: minsAfter(daysAgo(10), 5) },
    { lead_id: 'lead-ryan', channel: 'WHATSAPP', direction: 'INBOUND', message: 'That sounds perfect actually. Can you send me the details?', timestamp: minsAfter(daysAgo(10), 120) },

    // === Priya Sharma (QUALIFIED, Seattle) ===
    { lead_id: 'lead-priya', channel: 'WEBSITE', direction: 'INBOUND', message: 'Relocating to Seattle for Amazon. Looking for a 1-bedroom rental in Capitol Hill or Ballard. Budget $2,200-$3,000.', timestamp: daysAgo(8) },
    { lead_id: 'lead-priya', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Priya! Welcome to Seattle. We have a great 1BR in Capitol Hill with Lake Union views and a wraparound deck at $2,200/mo. Are you looking to move soon?', timestamp: minsAfter(daysAgo(8), 3) },

    // === Jordan Foster (QUALIFIED, Denver) ===
    { lead_id: 'lead-jordan', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Moving to Denver for a new role. Looking to buy a 3-bedroom in Cherry Creek or Wash Park. Budget $1.5M-$2.2M.', timestamp: daysAgo(12) },
    { lead_id: 'lead-jordan', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Welcome to Denver! We have a fantastic 3BR luxury condo in Cherry Creek at $1.65M — concierge, pool, club room, right near the mall. Interested?', timestamp: minsAfter(daysAgo(12), 15) },

    // === Olivia Brown (QUALIFIED, Atlanta) ===
    { lead_id: 'lead-olivia', channel: 'WEBSITE', direction: 'INBOUND', message: 'Looking to sell my 3-bedroom in Buckhead and downsize. Not sure what my place is worth. Can you help?', timestamp: daysAgo(9) },
    { lead_id: 'lead-olivia', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Olivia! Absolutely, we\'d be happy to do a market analysis on your Buckhead home. Could we come by this week to take a look and give you a comp-based valuation?', timestamp: minsAfter(daysAgo(9), 5) },

    // === Sophia Martinez (QUALIFIED, UES) ===
    { lead_id: 'lead-sophia', channel: 'OPEN_HOUSE', direction: 'INBOUND', message: 'We met at the open house on 72nd Street. I\'m pre-approved and looking for a 2-bedroom on the Upper East or Upper West Side. Budget $1.8M to $2.5M.', timestamp: daysAgo(11) },
    { lead_id: 'lead-sophia', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Sophia! Great meeting you at the open house. We have a lovely 2BR prewar on the UES with a wood-burning fireplace at $1.85M. Would you like a private showing?', timestamp: minsAfter(daysAgo(11), 30) },

    // === Maria Garcia (CONTACTED, Williamsburg) ===
    { lead_id: 'lead-maria', channel: 'WHATSAPP', direction: 'INBOUND', message: 'I saw your listing for a 2-bedroom in Williamsburg. Is it still available? My budget is around $5k.', timestamp: daysAgo(2) },
    { lead_id: 'lead-maria', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Maria! Yes, the Williamsburg 2BR is still available. Are you looking to rent? And what\'s your ideal move-in timeline?', timestamp: minsAfter(daysAgo(2), 1) },

    // === Ava Johnson (CONTACTED, Silver Lake) ===
    { lead_id: 'lead-ava', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Hey, looking for a 1-bedroom in Silver Lake or Echo Park. Budget $2.5k-$3.5k/month. Moving within the next month.', timestamp: daysAgo(3) },
    { lead_id: 'lead-ava', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Ava! We have a gorgeous 1BR in Silver Lake — not listed yet. Hillside views, saltwater pool, modern finishes. Want to be the first to see it?', timestamp: minsAfter(daysAgo(3), 3) },

    // === Rachel Green (COLD, investing) ===
    { lead_id: 'lead-rachel', channel: 'WEBSITE', direction: 'INBOUND', message: 'I\'m interested in investment properties in booming markets like Austin or Nashville. Send me multi-family or appreciation play info.', timestamp: daysAgo(90) },
    { lead_id: 'lead-rachel', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Rachel! Great timing — Austin and Nashville are two of the hottest markets right now. We have excellent multi-family and townhome investments. What budget range?', timestamp: minsAfter(daysAgo(90), 1) },
    { lead_id: 'lead-rachel', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Still doing research. I\'ll circle back when I\'m ready. Thanks!', timestamp: minsAfter(daysAgo(89), 30) },

    // === Kevin O'Brien (COLD, no intent) ===
    { lead_id: 'lead-kevin', channel: 'OPEN_HOUSE', direction: 'INBOUND', message: 'Just browsing at the open house. Not sure what I want yet but take my number.', timestamp: daysAgo(45) },
    { lead_id: 'lead-kevin', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Kevin! Nice chatting at the open house. If you ever want to explore options — buying, renting, investing — I\'m here to help. What part of the city interests you most?', timestamp: minsAfter(daysAgo(45), 60) },

    // === Alex Reynolds (CONVERTED, Chicago) ===
    { lead_id: 'lead-alex', channel: 'REFERRAL', direction: 'INBOUND', message: 'Michael Torres said you helped him in NYC. I need a 3-bedroom in Lincoln Park or Lakeview. Budget $1.8M to $2.5M.', timestamp: daysAgo(60) },
    { lead_id: 'lead-alex', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Great to hear from you Alex! Michael closed on a beautiful TriBeCa loft. We have an amazing 4BR Lincoln Park brownstone at $2.35M. Want details?', timestamp: minsAfter(daysAgo(60), 5) },
    { lead_id: 'lead-alex', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Please do! I\'m free Sunday afternoon.', timestamp: minsAfter(daysAgo(59), 60) },
    { lead_id: 'lead-alex', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Sunday at 2pm works. Sending address and photos now.', timestamp: minsAfter(daysAgo(59), 65) },
    { lead_id: 'lead-alex', channel: 'WHATSAPP', direction: 'INBOUND', message: 'I want to make an offer. $2.2M with a 30-day close.', timestamp: daysAgo(55) },
    { lead_id: 'lead-alex', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Strong offer! Let me present it to the sellers — I\'ll get back to you by tomorrow morning.', timestamp: minsAfter(daysAgo(55), 10) },

    // === Sandra Blake (CONVERTED, Miami) ===
    { lead_id: 'lead-sandra', channel: 'WEBSITE', direction: 'INBOUND', message: 'Looking for a 3-bedroom oceanfront condo in Miami Beach. Budget $3.5M to $4.5M.', timestamp: daysAgo(45) },
    { lead_id: 'lead-sandra', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Sandra! We have a stunning 3BR oceanfront in Mid-Beach at $4.2M. Direct ocean views, wrap-around terrace, marble baths. Want to schedule a tour?', timestamp: minsAfter(daysAgo(45), 3) },
    { lead_id: 'lead-sandra', channel: 'WHATSAPP', direction: 'INBOUND', message: 'That sounds perfect. I\'m flying into Miami next Tuesday. Can we see it then?', timestamp: minsAfter(daysAgo(44), 120) },

    // === Victor Tran (CONVERTED, Seattle) ===
    { lead_id: 'lead-victor', channel: 'REFERRAL', direction: 'INBOUND', message: 'My coworker bought through you and recommended you. Looking for a 3-bedroom in Capitol Hill or Ballard. Budget $900k to $1.3M.', timestamp: daysAgo(90) },
    { lead_id: 'lead-victor', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Victor, great to connect! We have a 3BR townhome in Ballard — rooftop deck, mountain views, 2-car garage — at $1.2M. Right in your range!', timestamp: minsAfter(daysAgo(90), 10) },
    { lead_id: 'lead-victor', channel: 'WHATSAPP', direction: 'INBOUND', message: 'Let\'s do a walkthrough this weekend. Saturday morning?', timestamp: minsAfter(daysAgo(89), 60) },

    // === Samir Gupta (COLD, Atlanta) ===
    { lead_id: 'lead-sam', channel: 'WEBSITE', direction: 'INBOUND', message: 'Thinking of buying a home in Atlanta or Alpharetta. Not in a hurry but want to start exploring options. Budget up to $1.2M for a 3-bedroom.', timestamp: daysAgo(60) },
    { lead_id: 'lead-sam', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Samir! Atlanta\'s a great market right now. We have a beautiful 3BR craftsman near the BeltLine and a Buckhead estate. Would you like to start with some listings?', timestamp: minsAfter(daysAgo(60), 12) },

    // === Grace Nguyen (COLD, Santa Monica) ===
    { lead_id: 'lead-grace', channel: 'REFERRAL', direction: 'INBOUND', message: 'A friend said you specialize in the Westside. We\'re thinking about buying a 3-bedroom in Pacific Palisades or Santa Monica. Budget $2M-$3M. Not in a huge rush.', timestamp: daysAgo(70) },
    { lead_id: 'lead-grace', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Grace! We do have some lovely Westside properties. We have a 2BR in Santa Monica steps from the beach and a few Palisades options. When would you like to start touring?', timestamp: minsAfter(daysAgo(70), 20) },

    // === Lily Chang (COLD, Portland) ===
    { lead_id: 'lead-lily', channel: 'WEBSITE', direction: 'INBOUND', message: 'Interested in investment properties in Portland or Bend. Looking to spend $300k-$600k on a multi-family or condo.', timestamp: daysAgo(80) },
    { lead_id: 'lead-lily', channel: 'WHATSAPP', direction: 'OUTBOUND', message: 'Hi Lily! Portland\'s market is excellent for investment right now. We have a few multi-family options in the Alberta Arts and Pearl districts. Would you like me to send some numbers?', timestamp: minsAfter(daysAgo(80), 5) },
  ]

  await prisma.conversation.createMany({ data: conversations })
  const leadIdsWithConvs = new Set(conversations.map(c => c.lead_id))
  console.log(`  ✓ Created ${conversations.length} conversations across ${leadIdsWithConvs.size} leads`)

  // ── Nurture Sequences ────────────────────────────────────────────
  await prisma.nurtureSequence.createMany({
    data: [
      { lead_id: 'lead-rachel', sequence_type: 'COLD_NURTURE', current_step: 3, next_send_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), active: true },
      { lead_id: 'lead-kevin',  sequence_type: 'COLD_NURTURE', current_step: 1, next_send_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), active: true },
      { lead_id: 'lead-sam',    sequence_type: 'COLD_NURTURE', current_step: 2, next_send_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), active: true },
      { lead_id: 'lead-chloe',  sequence_type: 'COLD_NURTURE', current_step: 1, next_send_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), active: true },
      { lead_id: 'lead-grace',  sequence_type: 'COLD_NURTURE', current_step: 1, next_send_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), active: true },
      { lead_id: 'lead-jason',  sequence_type: 'COLD_NURTURE', current_step: 2, next_send_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), active: true },
      { lead_id: 'lead-taylor', sequence_type: 'COLD_NURTURE', current_step: 1, next_send_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), active: true },
      { lead_id: 'lead-lily',   sequence_type: 'COLD_NURTURE', current_step: 1, next_send_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), active: true },
    ],
  })
  console.log('  ✓ Created 8 nurture sequences for cold leads')

  // ── Print summary ─────────────────────────────────────────────────
  const propCities = [...new Set(PROPERTIES.map(p => p.area))].sort()

  console.log('')
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║   ✅ SEED COMPLETE — MVP Demo Data Loaded               ║')
  console.log('╠══════════════════════════════════════════════════════════╣')
  console.log(`║   ${String(AGENTS.length).padStart(2)} agents across Premier Homes Realty                    ║`)
  console.log(`║   ${String(PROPERTIES.length).padStart(2)} properties in ${propCities.length} markets              ║`)
  console.log(`║   ${String(LEADS.length).padStart(2)} leads (${hotCount} HOT, ${qualifiedCount} QUAL, ${coldCount} COLD, ${convertedCount} CONV)   ║`)
  console.log(`║   ${String(conversations.length).padStart(2)} conversation messages logged                   ║`)
  console.log(`║   8 nurture sequences active                            ║`)
  console.log('╠══════════════════════════════════════════════════════════╣')
  console.log('║  HOT leads triggering agent alerts:                     ║')
  for (const l of LEADS.filter(l => l.status === 'HOT')) {
    const name = l.name.padEnd(18)
    const score = String(l.score).padStart(2)
    const pref = (l.location_pref ?? '').padEnd(30)
    console.log(`║    • ${name} score ${score}  ${pref}  ║`)
  }
  console.log('╠══════════════════════════════════════════════════════════╣')
  console.log('║  To re-run:  npx tsx prisma/seed.ts                     ║')
  console.log('║  To remove:  delete prisma/seed.ts                      ║')
  console.log('╚══════════════════════════════════════════════════════════╝')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
