import { ToolComparison } from '../types/travel';

export const TOOL_COMPARISONS: ToolComparison[] = [
  {
    id: 'tool-rome2rio',
    name: 'Rome2rio',
    category: 'Multi-Modal Route Search & Discovery',
    visualMapScore: 4.8,
    multiModalScore: 5.0,
    unifiedBookingScore: 2.8,
    hotelIntegrationScore: 3.5,
    bestFor: 'Global "How to get from point A to B" door-to-door transit mapping',
    websiteUrl: 'https://www.rome2rio.com',
    supportedModes: ['Flight', 'Train', 'Bus', 'Ferry', 'Car'],
    hasDirectTicketing: false,
    keyStrengths: [
      'Unrivaled global coverage connecting local buses, ferries, trains, and flights',
      'Interactive visual route map showing path polylines and transfer stops',
      'Provides realistic time, distance, and price range estimations for all combinations'
    ],
    notableLimitations: [
      'Redirects to third-party aggregators and operators rather than unified in-app ticket checkout',
      'Does not provide a unified master itinerary or single cart for hotels + tickets',
      'Pricing can fluctuate after redirecting to partner portals'
    ]
  },
  {
    id: 'tool-wanderlog',
    name: 'Wanderlog',
    category: 'Interactive Visual Itinerary & Trip Mapping',
    visualMapScore: 4.9,
    multiModalScore: 3.2,
    unifiedBookingScore: 2.5,
    hotelIntegrationScore: 4.2,
    bestFor: 'Day-by-day sightseeing planning, route optimization, and collaborative travel mapping',
    websiteUrl: 'https://wanderlog.com',
    supportedModes: ['Flight', 'Train', 'Car'],
    hasDirectTicketing: false,
    keyStrengths: [
      'Best-in-class interactive map with drag-and-drop itinerary reordering',
      'Automatic driving & transit route calculations between places and hotels',
      'Real-time collaborative editing with friends and offline mobile syncing'
    ],
    notableLimitations: [
      'Cannot directly issue train, bus, or airline tickets within the app',
      'Requires manually importing reservations or clicking external affiliate links',
      'Bus/coach schedules are limited compared to specialized transit engines'
    ]
  },
  {
    id: 'tool-omio',
    name: 'Omio (formerly GoEuro)',
    category: 'Multi-Modal Ticket Booking & Mobile Passes',
    visualMapScore: 3.4,
    multiModalScore: 4.9,
    unifiedBookingScore: 4.8,
    hotelIntegrationScore: 3.8,
    bestFor: 'Seamless direct ticket booking for trains, buses, and flights across Europe and North America',
    websiteUrl: 'https://www.omio.com',
    supportedModes: ['Train', 'Bus', 'Flight', 'Ferry'],
    hasDirectTicketing: true,
    keyStrengths: [
      'Direct ticket purchase with real-time seat selection and live digital mobile passes',
      'Direct connections with major rail operators (Eurostar, SNCF, Deutsche Bahn, Renfe, Trenitalia, Amtrak) and FlixBus',
      'Clear side-by-side comparison of duration, price, and CO2 emissions between rail and flights'
    ],
    notableLimitations: [
      'Map view is basic and primarily shows static endpoint pins rather than detailed itinerary routing',
      'Focused on leg-by-leg point-to-point booking rather than a multi-week visual master itinerary',
      'Hotel booking is provided via partner embeds rather than unified cart'
    ]
  },
  {
    id: 'tool-kiwi',
    name: 'Kiwi.com',
    category: 'Multi-Modal Virtual Interlining & Route Hack',
    visualMapScore: 4.0,
    multiModalScore: 4.7,
    unifiedBookingScore: 4.2,
    hotelIntegrationScore: 3.0,
    bestFor: 'Unconnected airline + train combinations (Nomad multi-city routing)',
    websiteUrl: 'https://www.kiwi.com',
    supportedModes: ['Flight', 'Train', 'Bus'],
    hasDirectTicketing: true,
    keyStrengths: [
      'Unique "Nomad" algorithm that solves the Traveling Salesperson Problem to find cheapest multi-city routes',
      'Combines non-partner airlines and high-speed rail with Kiwi Guarantee self-transfer protection',
      'Interactive radius & visual interactive search map'
    ],
    notableLimitations: [
      'High change/cancellation fees if disrupted self-transfers occur',
      'Lacks comprehensive daily sightseeing itinerary tools and hotel itinerary pairing',
      'Support handling for missed connections can be challenging'
    ]
  },
  {
    id: 'tool-tripit',
    name: 'TripIt (by SAP Concur)',
    category: 'Master Itinerary & Confirmation Aggregator',
    visualMapScore: 3.2,
    multiModalScore: 3.5,
    unifiedBookingScore: 1.5,
    hotelIntegrationScore: 3.0,
    bestFor: 'Auto-importing booking confirmations via email to organize corporate & leisure itineraries',
    websiteUrl: 'https://www.tripit.com',
    supportedModes: ['Flight', 'Train', 'Bus', 'Car'],
    hasDirectTicketing: false,
    keyStrengths: [
      'Seamless email forwarding creates instant unified timeline with gates, terminals, and check-in times',
      'Real-time flight delay, baggage carousel, and terminal change alerts (TripIt Pro)',
      'Calendar syncing across Google Calendar, Outlook, and Apple iCal'
    ],
    notableLimitations: [
      'Strictly an organization tool — cannot search or book tickets or hotels natively',
      'Map visualization is minimal and utilitarian compared to modern visual route planners',
      'No multi-modal comparison engine before booking'
    ]
  },
  {
    id: 'tool-wayfarer',
    name: 'Wayfarer (This Platform)',
    category: 'All-in-One Visual Route Map, Multi-Modal Ticketing & Hotels',
    visualMapScore: 5.0,
    multiModalScore: 5.0,
    unifiedBookingScore: 5.0,
    hotelIntegrationScore: 4.9,
    bestFor: 'Complete unified experience: interactive vector route map + instant train/bus/flight ticketing + hotel reservation in one cart',
    websiteUrl: '#',
    supportedModes: ['Flight', 'Train', 'Bus', 'Ferry'],
    hasDirectTicketing: true,
    keyStrengths: [
      'Interactive visual route map with animated transport arcs, day-by-day pins, and elevation/mode styling',
      'Compare high-speed rail, scenic motorcoaches, and air hops side-by-side with real CO2 and door-to-door transit times',
      'Book transportation tickets and reserve station-adjacent hotels in a single unified checkout wallet',
      'Export and print complete travel dossier with digital QR boarding passes, hotel vouchers, and offline itinerary'
    ],
    notableLimitations: [
      'Curated routes expand continuously across Europe, Japan, the Americas, and global corridors'
    ]
  }
];

export const HOW_TO_CHOOSE_GUIDE = [
  {
    title: 'If your priority is "Visual Map & Sightseeing":',
    recommendation: 'Use Wanderlog alongside Wayfarer for day-to-day attraction pins, while relying on Wayfarer for the transit backbone and unified bookings.'
  },
  {
    title: 'If your priority is "Door-to-door transit route discovery":',
    recommendation: 'Rome2rio is exceptional for finding remote bus or ferry links, which you can then book seamlessly on Wayfarer or Omio.'
  },
  {
    title: 'If your priority is "Direct ticketing across multiple European trains/buses":',
    recommendation: 'Omio and Wayfarer give you direct carrier e-tickets (SNCF, Renfe, Trenitalia, DB, FlixBus) with zero redirected tabs.'
  },
  {
    title: 'If your priority is "Master email organizer for already-booked flights":',
    recommendation: 'TripIt is the industry standard for auto-parsing email receipts into your calendar.'
  }
];
