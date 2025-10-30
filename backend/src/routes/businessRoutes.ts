import { Router } from 'express'
import businessController from '../controllers/businessController.js'

const businessRouter = Router()

// this route fetches all the businesses
businessRouter.get('/api/businesses', businessController.getAllBusinesses.bind(businessController));

// // triggered by a user using the filters, this route fetches business objects matching the filters
businessRouter.post('/api/businesses/filter', businessController.getFilteredBusinesses.bind(businessController))

// triggered by a user clicking the View Details button, this route fetches a single business from the database
businessRouter.get('/api/business', businessController.getBusinessByUEN.bind(businessController))

// this route handles business registration
businessRouter.post('/api/register-business', businessController.registerBusiness.bind(businessController))

export default businessRouter