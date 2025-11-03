// src/main.ts
import {
    displayAndFilterBusinesses,
    closeDetails,
    setupFilters,
} from "./utils/functions";

const cardContainer = document.getElementById("cardContainer")!;

// Initialize filters object
const filters: Record<string, any> = {};

// Setup filter inputs and listeners
setupFilters(filters, cardContainer);

const closeBtn = document.getElementById("closeDetails")!;
closeBtn.addEventListener("click", closeDetails);

displayAndFilterBusinesses(filters, cardContainer);