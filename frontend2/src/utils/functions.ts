import axios from "axios";

interface Business {
  uen: string;
  businessName: string;
  description: string;
  address: string;
  phoneNumber: string;
  wallpaper: string;
  open247: number;
  openingHours: Record<string, { open: string; close: string }>;
  website_link?: string;
  social_media_link?: string;
}

/**
 * Determines open/closed status
 */
export function displayOpenOrClosed(dailyOpeningHours: Business['openingHours'], open247: number): string {
  const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const now = new Date();
  const dayToday = daysOfWeek[now.getDay()];

  if (open247 === 1) return 'Open 24/7';

  const todayHours = dailyOpeningHours[dayToday];
  if (todayHours) {
    const [openHour, openMinute] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);

    const openingTime = new Date(now);
    openingTime.setHours(openHour, openMinute, 0, 0);
    const closingTime = new Date(now);
    closingTime.setHours(closeHour, closeMinute, 0, 0);

    if (now >= openingTime && now <= closingTime) {
      return `Open - Closes at ${closingTime.getHours().toString().padStart(2,'0')}:${closingTime.getMinutes().toString().padStart(2,'0')}`;
    } else {
      return `Closed - Opens at ${openingTime.getHours().toString().padStart(2,'0')}:${openingTime.getMinutes().toString().padStart(2,'0')}`;
    }
  }

  // Next open day
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + i);
    const nextDay = daysOfWeek[nextDate.getDay()];
    if (dailyOpeningHours[nextDay]) {
      return `Closed - Opens on ${nextDay} at ${dailyOpeningHours[nextDay].open}`;
    }
  }

  return 'Closed for the week';
}

/**
 * Format a business as Bootstrap card
 */
export function formatAsBootstrapCard(business: Business): HTMLDivElement {
  const businessCard = document.createElement('div');
  businessCard.className = 'col-md-4 mb-4';

  const cardDiv = document.createElement('div');
  cardDiv.className = 'card h-100 shadow-sm';

  const img = document.createElement('img');
  img.src = 'https://localoco.blob.core.windows.net/images/' + business.wallpaper;
  img.className = 'card-img-top h-50 object-fit-cover';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = business.businessName;

  const desc = document.createElement('p');
  desc.className = 'card-text';
  desc.textContent = business.description;

  const address = document.createElement('p');
  address.className = 'card-text';
  address.textContent = business.address;

  const phone = document.createElement('p');
  phone.className = 'card-text';
  phone.textContent = business.phoneNumber;

  const status = document.createElement('p');
  status.className = 'card-text';
  status.textContent = displayOpenOrClosed(business.openingHours, business.open247);

  const viewDetailsButton = document.createElement('button');
  viewDetailsButton.className = 'btn btn-dark';
  viewDetailsButton.innerText = 'View Details';
  viewDetailsButton.addEventListener('click', () => {
    showDetails(business.uen);
  });

  cardBody.append(title, desc, address, phone, status, viewDetailsButton);
  cardDiv.append(img, cardBody);
  businessCard.appendChild(cardDiv);

  return businessCard;
}

/**
 * Fetch and display businesses
 */
export async function displayAndFilterBusinesses(filters: Record<string, any>, cardContainer: HTMLElement) {
  cardContainer.replaceChildren(); // clear existing cards

  try {
    const response = Object.keys(filters).length === 0
      ? await axios.get<Business[]>('/api/businesses')
      : await axios.post<Business[]>('/api/businesses/filter', filters);

    const businesses = response.data;
    if (businesses.length === 0) {
      cardContainer.innerText = 'No matches found for your search query.';
      return;
    }

    businesses.forEach(biz => {
      const card = formatAsBootstrapCard(biz);
      cardContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
  }
}

/**
 * Fetch and display details
 */
export async function showDetails(uen: string) {
  const detailsContainer = document.getElementById('display_details')!;
  const mainCardContainer = document.getElementById('cardContainer')!;
  const filteringBar = document.getElementById('filtering_bar')!;

  try {
    const response = await axios.get<Business>('/api/business', { params: { uen } });
    const business = response.data;

    (document.getElementById('display_details_image') as HTMLImageElement).src =
      'https://localoco.blob.core.windows.net/images/' + business.wallpaper;
    (document.getElementById('description')!).innerText = business.description;
    (document.getElementById('address')!).innerHTML = `<strong>Address:</strong> ${business.address}`;
    (document.getElementById('phone')!).innerHTML = `<strong>Phone:</strong> ${business.phoneNumber}`;
    (document.getElementById('website_link')!).innerHTML = `<strong>Website:</strong> <a href="${business.website_link || '#'}" target="_blank">${business.website_link || '-'}</a>`;
    (document.getElementById('social_media_link')!).innerHTML = `<strong>Social Media:</strong> <a href="${business.social_media_link || '#'}" target="_blank">${business.social_media_link || '-'}</a>`;

    const openingHoursList = document.getElementById('opening_hours')!;
    openingHoursList.innerHTML = '';
    if (business.open247 === 1) {
      (document.getElementById('isOpen247')!).innerText = 'Open 24/7';
    } else {
      Object.entries(business.openingHours || {}).forEach(([day, times]) => {
        const li = document.createElement('li');
        li.innerText = `${day}: ${times.open} - ${times.close}`;
        openingHoursList.appendChild(li);
      });
    }

    mainCardContainer.style.display = 'none';
    filteringBar.style.display = 'none';
    detailsContainer.style.display = 'block';
  } catch (err) {
    console.error(err);
  }
}

/**
 * Close details view
 */
export function closeDetails() {
  const detailsContainer = document.getElementById('display_details')!;
  const mainCardContainer = document.getElementById('cardContainer')!;
  const filteringBar = document.getElementById('filtering_bar')!;
  const openingHours = document.getElementById('opening_hours')!;

  detailsContainer.style.display = 'none';
  mainCardContainer.style.display = '';
  filteringBar.style.display = '';
  openingHours.innerHTML = '';
}

export function setupFilters(filters: Record<string, any>, cardContainer: HTMLElement) {
  const searchInput = document.getElementById('search_query') as HTMLInputElement;
  const businessCategory = document.getElementById('business_category') as HTMLSelectElement;
  const priceTier = document.getElementById('price_tier') as HTMLSelectElement;
  const newlyAdded = document.getElementById('newly_added') as HTMLInputElement;
  const open247 = document.getElementById('open247') as HTMLInputElement;
  const offersDelivery = document.getElementById('offers_delivery') as HTMLInputElement;
  const offersPickup = document.getElementById('offers_pickup') as HTMLInputElement;

  searchInput.addEventListener('keyup', () => {
    filters['search_query'] = searchInput.value || undefined;
    displayAndFilterBusinesses(filters, cardContainer);
  });

  businessCategory.addEventListener('change', () => {
    filters['business_category'] = businessCategory.value || undefined;
    displayAndFilterBusinesses(filters, cardContainer);
  });

  priceTier.addEventListener('change', () => {
    filters['price_tier'] = priceTier.value || undefined;
    displayAndFilterBusinesses(filters, cardContainer);
  });

  newlyAdded.addEventListener('change', () => {
    filters['newly_added'] = newlyAdded.checked || undefined;
    displayAndFilterBusinesses(filters, cardContainer);
  });

  open247.addEventListener('change', () => {
    filters['open247'] = open247.checked || undefined;
    displayAndFilterBusinesses(filters, cardContainer);
  });

  offersDelivery.addEventListener('change', () => {
    filters['offers_delivery'] = offersDelivery.checked || undefined;
    displayAndFilterBusinesses(filters, cardContainer);
  });

  offersPickup.addEventListener('change', () => {
    filters['offers_pickup'] = offersPickup.checked || undefined;
    displayAndFilterBusinesses(filters, cardContainer);
  });
}
