export interface Env {
	failcat_db: D1Database;
}

import { scrapeVin } from "./vinlookup";

export default {
async fetch(request: Request, env: Env) {
		const { pathname, searchParams } = new URL(request.url);
    const offset = searchParams.get("offset") || 0;
    const perPage = searchParams.get("perPage") || 10;

		// Now with query params for pagination
		if (pathname === "/api/cars") {
			try {
				const { results } = await env.failcat_db
					.prepare("SELECT * FROM cars order by id desc limit ? offset ?")
          .bind(offset, perPage)
					.all();
				const response = Response.json(results);
				response.headers.set("Access-Control-Allow-Origin", "*");
				return response;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (e: any) {
				console.log({ message: e.message, error: e.error });
				return new Response(e.message, { status: 500 });
			}
		} else if (pathname === "/api/vin") {
      const [car, dealer, carModel] = await scrapeVin('5XYP34GC5PG389249');
      console.log("VIN lookup", car, dealer, carModel);
      return "lol";
    }

		return new Response("Call /api/cars to see a few cars");
	},
};
