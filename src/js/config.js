/**
 * The Indian Plate — business configuration
 * -------------------------------------------------
 * Edit ONLY the values below to update business details across the whole
 * website (contact section, header button, WhatsApp links, structured data).
 * No other code changes are required.
 */
window.SITE_CONFIG = {
  businessName: "The Indian Plate",
  tagline: "Authentic Homemade Indian Food",
  domain: "https://theindianplate.co.uk",

  // Phone number shown to customers and used for the "Call Now" button.
  // Use a normal readable UK format, e.g. "01234 567890" or "07123 456789".
  phone: "07436 446532",

  // WhatsApp number MUST be in full international format with no spaces,
  // no "+" and no leading zero, e.g. UK 07123 456789 -> "447123456789".
  whatsappNumber: "447436446532",

  address: {
    line1: "4 Empire Court",
    line2: "Avon Street (first building)",
    city: "Rugby",
    postcode: "CV21 2LS",
    country: "United Kingdom"
  },

  // Used to build a Google Maps "Get Directions" link.
  mapsQuery: "4 Empire Court, Avon Street, Rugby, CV21 2LS, United Kingdom",

  openingHours: [
    { day: "Monday", hours: "Closed" },
    { day: "Tuesday", hours: "5:00 PM – 9:30 PM" },
    { day: "Wednesday", hours: "5:00 PM – 9:30 PM" },
    { day: "Thursday", hours: "5:00 PM – 9:30 PM" },
    { day: "Friday", hours: "5:00 PM – 10:00 PM" },
    { day: "Saturday", hours: "1:00 PM – 10:00 PM" },
    { day: "Sunday", hours: "1:00 PM – 9:00 PM" }
  ],

  // Placeholder — confirm and edit to match the areas you actually deliver to.
  deliveryAreas: [
    "Rugby Town Centre",
    "Bilton",
    "Hillmorton",
    "Newbold",
    "Brownsover",
    "Long Lawford"
  ],

  social: {
    facebook: "https://www.facebook.com/profile.php?id=61576523743639",
    instagram: "https://instagram.com/theindianplate",
    tiktok: ""
  },

  // Default message pre-filled into WhatsApp when a customer taps an order button.
  whatsappDefaultMessage: "Hi The Indian Plate, I would like to place an order."
};
