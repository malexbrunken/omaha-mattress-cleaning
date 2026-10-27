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
- Operated by Sleep Sanitation (https://sleepsanitation.com). Founder: Matthew Brunken (https://sleepsanitation.com/matthew-brunken).
- Service area: Omaha, Elkhorn, Papillion, La Vista, Bellevue, Gretna, Ralston, Chalco, Bennington, Waterloo, Valley and Council Bluffs.
- Phone (call or text): ${PHONE.display}. Email: info@sleepsanitation.com. Hours: Monday–Friday, 9am–6pm; calls and texts are returned on weekends.
- Price: ${priceText.first} for the first mattress in any size. Normal stains, pet odor and ordinary urine accidents are included; a surcharge applies only to severe or biohazard cases. Each additional king mattress in the same visit is ${priceText.additionalKing} and each additional full or queen is ${priceText.additionalFullQueen}, each additional twin or kids bed is ${priceText.additionalKids}, and underside or full-surface treatment is ${priceText.underside} per mattress.
- Equipment: Italian Vapor Clean dry vapor steam machines (the Magnum XP with vac and the Desiderio as our main machines, plus the ProV 350 and Pro6 Duo for select applications), with steam output and pass speed adjusted to each mattress.
- A material inspection comes first: we read the law tag and check construction, fabric and stains before choosing the steam setting and pass speed.
- Seams, tufts, ridges and edges are steamed with low-moisture dry vapor steam, along with the top surface and all four sides.
- A JIGOO mattress vacuum with HEPA filtration lifts loosened debris and delivers UV-C light treatment.
- Enzymes are used for urine and organic odor. Organic cleaning methods are the default.
- Bed mites (house dust mites) are addressed with dry vapor steam heat at the surface and HEPA vacuuming.
- The two checks in every visit: a moisture check after the job; the built-in bed mite sensor on the JIGOO UV-C mattress vacuum.
- Every job is documented on a service summary: the mattress inspection, the sanitation performed (mattress surface temperature verified at 212°F or higher with a temperature gun) and technician confirmation. You receive a copy.
- The bed stays unmade until it is dry to the touch, and we run a moisture check before we leave.
- Technicians wear gloves and shoe booties, and equipment is cleaned and sanitized between jobs.
- Optional: 72-hour bedroom CO₂ testing is an optional service, booked on its own or added to a mattress visit. It's priced by quote, and it isn't a medical test.

## How to book
- Call or text ${PHONE.display}, or email info@sleepsanitation.com.
- Have ready: your town, how many mattresses and their sizes, anything that needs extra attention, and a few days and times that work.
- We confirm a time and your price. A visit takes about 1–2 hours per mattress.

## Scope
- Mattresses only. Surface sanitation of the mattress, not disinfection. Not a medical treatment or cure.
- Not bed bug or pest control. Not powered air, low-air-loss or alternating-pressure mattresses. We don't bill insurance.

## Parent company
- [Sleep Sanitation llms.txt](https://sleepsanitation.com/llms.txt) (full fact sheet, Knowledge Center and Markdown versions of pages)

- Current offers: ${u("/pricing")}

## Key pages
- [Pricing](${u("/pricing")})
- [Book or contact](${u("/book")})
- [About](${u("/about")})
- [Areas we serve](${u("/areas")})
- [Omaha homes guides](${u("/omaha-homes")})
- [Omaha winter dry air, humidifiers and dust mites](${u("/omaha-homes/winter-dry-air-humidifiers-and-dust-mites")})
- [Allergy season in Omaha](${u("/allergy-season")})
- [Care providers: home health, hospice, home care, assisted living](${u("/care-providers")})
- [Airbnb and short-term rental hosts](${u("/airbnb-hosts")})
- [Omaha developments](${u("/developments")})
- [Omaha neighborhoods: Millard, Dundee, Benson, Aksarben, Blackstone](${u("/neighborhoods")})
- [Omaha life events: holiday guests, new baby, used or inherited mattress, new pet](${u("/life-events")})
- [Holiday guest-room mattress reset](${u("/life-events/holiday-guest-room-reset")})
- [New baby: mattress prep before the due date](${u("/life-events/new-baby-nursery-prep")})
- [Used or inherited mattress](${u("/life-events/used-or-inherited-mattress")})
- [New dog or cat: a plan for the bed](${u("/life-events/new-pet-from-the-shelter")})
- [Holiday guest-bed reset in Bellevue and Papillion](${u("/life-events/holiday-guest-bed-reset-bellevue-papillion")})
- [Compare: dry vapor steam vs wet extraction](${u("/compare/dry-vapor-vs-wet-extraction")})
- [Compare: mattress specialist or carpet cleaner](${u("/compare/mattress-cleaning-vs-carpet-cleaner")})
- [Knowledge Center](${u("/knowledge-center")})
- [Sleep Sanitation pricing (parent company)](https://sleepsanitation.com/pricing)
- [Sleep Sanitation Knowledge Center](https://sleepsanitation.com/knowledge-center)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
