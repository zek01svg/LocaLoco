import { 
  displayAndFilterBusinesses, 
  closeDetails, 
  setupFilters 
} from './utils/functions';

const cardContainer = document.getElementById('cardContainer')!;

// Initialize filters object
const filters: Record<string, any> = {};

// Setup filter inputs and listeners
setupFilters(filters, cardContainer);

// Close details button
const closeBtn = document.getElementById('closeDetails')!;
closeBtn.addEventListener('click', closeDetails);

// Initial load
displayAndFilterBusinesses(filters, cardContainer);