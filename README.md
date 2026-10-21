# Kramar Rent Car

Premium car-rental website concept for the Costa Blanca, built with React, Vite and React Router.

## Run locally (Mac / VS Code)
1. Install Node.js (LTS) and open this folder in VS Code.
2. Open Terminal → New Terminal.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL shown by Vite (normally http://localhost:5173/).
5. Before delivery, run `npm run build` to create the production build in `dist/`.

## Where to edit content
- Vehicle list, base daily rates, deposits and image paths: `src/App.jsx`, in the `cars` array.
- Rental rate tiers: `rateMultipliers` and `rateLabels` in `src/App.jsx`.
- EN / ES / UA interface text: `copy` object in `src/App.jsx`.
- Rental condition accordion text: `conditionTitles` and `conditionContent` in `src/App.jsx`.
- Visual styling and responsive rules: `src/App.css` and `src/index.css`.

## Important business/legal notes
- Rates and deposits are indicative demonstration values only. Confirm every vehicle's commercial rates, deposit, insurance excess, mileage limits, territory and service fees before publication.
- Rental conditions are a draft content structure, not approved contractual terms. Have the business and a qualified Spanish legal/insurance professional confirm the wording.
- No approved rental agreement PDF has been supplied; the agreement section explicitly indicates this.
- The enquiry action opens an email draft. It does not check live availability, take payment or confirm a reservation. A backend/booking service is a separate development stage.
- Only the Porsche 911 currently has its supplied four-photo gallery. Other vehicles retain the existing hero image as a temporary placeholder until approved photos are supplied.
- The contact details in the site are demonstration details and must be verified.
