import json2html from "node-json2html";
const { render, component } = json2html;

export interface Env {
  failcat_db: D1Database;
}

let template_table_body = {
  "<>": "tr", "html": [
      {"<>": "td", "html": "${Performance}"}
  ]
}

export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/cars") {
      const { results } = await env.failcat_db.prepare(
        "SELECT * FROM cars order by id desc limit 10"
      )
      .all();
      return render(results, {}, {});
    }

    return new Response(
      "Call /api/cars to see a few cars"
    );
  },
};
