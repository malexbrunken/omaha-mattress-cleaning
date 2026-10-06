import type { APIRoute } from "astro";
import { priceText } from "../lib/prices";
import { PHONE } from "../lib/founder";

const SITE = "https://omahamattresscleaning.com";
const u = (p: string) => `${SITE}${p}`;

/** Plain-text summary for AI tools. Prices come from src/lib/prices.ts; promos stay on /pricing. */
export const GET: APIRoute = () => {
  const body = `# Omaha Mattress Cleaning & Sanitation

> Omaha Mattress Cleaning & Sanitation is a mattress-only cleaning and sanitation service for the Omaha–Council Bluffs metro, operated by Sleep Sanitation. Call or text ${PHONE.display}.

## Key facts
- Operated by Sleep Sanitation (https://sleepsanitation.com). Founder: Matthew Brunken.
- Service area: Omaha, Elkhorn, Papillion, La Vista, Bellevue, Gretna, Ralston, Chalco, Bennington, Waterloo, Valley and Council Bluffs.
- Hours: Monday to Friday, 9am to 6pm. Calls and texts are returned on weekends.
- Method: a material inspection first, then low-moisture dry vapor steam on the surface, seams, tufts, ridges and edges, HEPA vacuuming and UV-C light treatment. Enzyme treatment for urine and organic odor; organic methods by default.
- Every visit includes two checks: a moisture check after the job and the built-in bed mite sensor on the UV-C vacuum.
- The bed stays unmade until it is dry to the touch, and we run a moisture check before we leave.
- Every job is documented on an inspection form: materials, special care notes and any urine or odor observations.
- Technicians wear gloves and shoe booties, and equipment is disinfected between jobs.
- 72-hour bedroom CO₂ testing is an optional service, booked on its own or added to a mattress visit. It's priced by quote, and it isn't a medical test.

## Price
- First mattress: ${priceText.first}, any size. Normal stains, pet odor and ordinary urine accidents included.
- Each additional full, queen or king mattress in the same visit: ${priceText.additionalLarge}.
- Each additional kids' bed (twin or full) in the same visit: ${priceText.additionalKids}.
- Underside treatment: ${priceText.underside} per mattress.
- Severe or biohazard urine or odor: surcharge, quoted before we start.
- See ${u("/pricing")} for current offers.

## Key pages
- [Pricing](${u("/pricing")})
- [Book or contact](${u("/book")})
- [About](${u("/about")})
- [Areas we serve](${u("/areas")})
- [Omaha homes guides](${u("/omaha-homes")})
- [Allergy season in Omaha](${u("/allergy-season")})
- [Airbnb and short-term rental hosts](${u("/airbnb-hosts")})
- [Omaha developments](${u("/developments")})
- [Omaha life events: holiday guests, new baby, used or inherited mattress, new pet](${u("/life-events")})
- [Holiday guest-room mattress reset](${u("/life-events/holiday-guest-room-reset")})
- [New baby: mattress prep before the due date](${u("/life-events/new-baby-nursery-prep")})
- [Used or inherited mattress](${u("/life-events/used-or-inherited-mattress")})
- [New dog or cat: a plan for the bed](${u("/life-events/new-pet-from-the-shelter")})
- [Compare: dry vapor steam vs wet extraction](${u("/compare/dry-vapor-vs-wet-extraction")})
- [Compare: mattress specialist or carpet cleaner](${u("/compare/mattress-cleaning-vs-carpet-cleaner")})
- [Knowledge Center](${u("/knowledge-center")})
- [Sleep Sanitation pricing (parent company)](https://sleepsanitation.com/pricing)
- [Sleep Sanitation Knowledge Center](https://sleepsanitation.com/knowledge-center)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
