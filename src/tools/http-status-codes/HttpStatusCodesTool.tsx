import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import { Panel } from "@/components/layout";

interface Parsed {
  id: string;
  description: string;
  category: string;
  color: string;
}

const STATUS_CODES: Parsed[] = [
  // 1xx
  { id: "100", description: "Continue — the client should continue with its request.", category: "1xx Informational", color: "text-blue-500" },
  { id: "101", description: "Switching Protocols — server agrees to switch protocols.", category: "1xx Informational", color: "text-blue-500" },
  { id: "102", description: "Processing — server has received the request but not completed it yet.", category: "1xx Informational", color: "text-blue-500" },
  { id: "103", description: "Early Hints — used to return headers before the final response.", category: "1xx Informational", color: "text-blue-500" },
  // 2xx
  { id: "200", description: "OK — request succeeded.", category: "2xx Success", color: "text-green-500" },
  { id: "201", description: "Created — request succeeded and a new resource was created.", category: "2xx Success", color: "text-green-500" },
  { id: "202", description: "Accepted — request received but not yet acted upon.", category: "2xx Success", color: "text-green-500" },
  { id: "203", description: "Non-Authoritative Information — response from a proxy that modified the origin's 200.", category: "2xx Success", color: "text-green-500" },
  { id: "204", description: "No Content — request succeeded but there is no response body.", category: "2xx Success", color: "text-green-500" },
  { id: "205", description: "Reset Content — tells the client to reset the document view.", category: "2xx Success", color: "text-green-500" },
  { id: "206", description: "Partial Content — response to a Range request.", category: "2xx Success", color: "text-green-500" },
  { id: "207", description: "Multi-Status — WebDAV: multiple status codes in the body.", category: "2xx Success", color: "text-green-500" },
  { id: "208", description: "Already Reported — WebDAV: members already enumerated.", category: "2xx Success", color: "text-green-500" },
  { id: "226", description: "IM Used — response is result of one or more instance-manipulations.", category: "2xx Success", color: "text-green-500" },
  // 3xx
  { id: "300", description: "Multiple Choices — multiple options for the resource.", category: "3xx Redirection", color: "text-yellow-500" },
  { id: "301", description: "Moved Permanently — URI of resource has changed.", category: "3xx Redirection", color: "text-yellow-500" },
  { id: "302", description: "Found — URI changed temporarily.", category: "3xx Redirection", color: "text-yellow-500" },
  { id: "303", description: "See Other — retrieve the resource with GET at a different URI.", category: "3xx Redirection", color: "text-yellow-500" },
  { id: "304", description: "Not Modified — cache is still valid, no need to retransmit.", category: "3xx Redirection", color: "text-yellow-500" },
  { id: "307", description: "Temporary Redirect — same as 302 but must not change method.", category: "3xx Redirection", color: "text-yellow-500" },
  { id: "308", description: "Permanent Redirect — same as 301 but must not change method.", category: "3xx Redirection", color: "text-yellow-500" },
  // 4xx
  { id: "400", description: "Bad Request — server cannot process the request due to client error.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "401", description: "Unauthorized — authentication is required and has failed.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "402", description: "Payment Required — reserved for future use.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "403", description: "Forbidden — client does not have access to the content.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "404", description: "Not Found — server cannot find the requested resource.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "405", description: "Method Not Allowed — request method is known but not supported.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "406", description: "Not Acceptable — no content matching the criteria found.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "407", description: "Proxy Authentication Required — client must authenticate with the proxy.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "408", description: "Request Timeout — server timed out waiting for the request.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "409", description: "Conflict — request conflicts with the current state of the server.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "410", description: "Gone — resource is no longer available and will not be back.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "411", description: "Length Required — Content-Length header is required.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "412", description: "Precondition Failed — client header preconditions not met.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "413", description: "Payload Too Large — request body exceeds server limits.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "414", description: "URI Too Long — URI is longer than the server will process.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "415", description: "Unsupported Media Type — media format not supported.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "416", description: "Range Not Satisfiable — range in Range header cannot be fulfilled.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "417", description: "Expectation Failed — Expect header cannot be met.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "418", description: "I'm a Teapot — server refuses to brew coffee (RFC 2324).", category: "4xx Client Error", color: "text-orange-500" },
  { id: "421", description: "Misdirected Request — request directed to a server that cannot respond.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "422", description: "Unprocessable Entity — well-formed but has semantic errors.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "423", description: "Locked — WebDAV: resource is locked.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "424", description: "Failed Dependency — WebDAV: previous request failed.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "425", description: "Too Early — server not willing to risk processing a replayed request.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "426", description: "Upgrade Required — client should switch to a different protocol.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "428", description: "Precondition Required — origin server requires conditional request.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "429", description: "Too Many Requests — user has sent too many requests (rate limiting).", category: "4xx Client Error", color: "text-orange-500" },
  { id: "431", description: "Request Header Fields Too Large — header fields too large.", category: "4xx Client Error", color: "text-orange-500" },
  { id: "451", description: "Unavailable For Legal Reasons — resource denied for legal reasons.", category: "4xx Client Error", color: "text-orange-500" },
  // 5xx
  { id: "500", description: "Internal Server Error — server encountered an unexpected condition.", category: "5xx Server Error", color: "text-red-500" },
  { id: "501", description: "Not Implemented — request method not supported by the server.", category: "5xx Server Error", color: "text-red-500" },
  { id: "502", description: "Bad Gateway — upstream server gave an invalid response.", category: "5xx Server Error", color: "text-red-500" },
  { id: "503", description: "Service Unavailable — server not ready (overload or maintenance).", category: "5xx Server Error", color: "text-red-500" },
  { id: "504", description: "Gateway Timeout — upstream server did not respond in time.", category: "5xx Server Error", color: "text-red-500" },
  { id: "505", description: "HTTP Version Not Supported — HTTP version not supported.", category: "5xx Server Error", color: "text-red-500" },
  { id: "507", description: "Insufficient Storage — WebDAV: server cannot store the representation.", category: "5xx Server Error", color: "text-red-500" },
  { id: "508", description: "Loop Detected — WebDAV: infinite loop detected.", category: "5xx Server Error", color: "text-red-500" },
  { id: "510", description: "Not Extended — further extensions to the request are required.", category: "5xx Server Error", color: "text-red-500" },
  { id: "511", description: "Network Authentication Required — client needs to authenticate for network access.", category: "5xx Server Error", color: "text-red-500" },
];

const CATEGORIES = ["All", "1xx Informational", "2xx Success", "3xx Redirection", "4xx Client Error", "5xx Server Error"];

export default function HttpStatusCodesTool() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return STATUS_CODES.filter(c =>
      (category === "All" || c.category === category) &&
      (c.id.includes(q) || c.description.toLowerCase().includes(q))
    );
  }, [search, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, Parsed[]>();
    for (const c of filtered) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code or description..." />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 rounded-md bg-(--surface-elevated) text(--text-primary) border border-(--border-default) text-sm"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </Panel>

      {[...grouped.entries()].map(([cat, codes]) => (
        <Panel key={cat}>
          <h3 className="text-sm font-semibold text(--text-primary) mb-3">{cat}</h3>
          <div className="space-y-2">
            {codes.map(c => (
              <div key={c.id} className="flex gap-3 px-3 py-2.5 rounded-md bg-(--surface-secondary) hover:bg-(--surface-elevated) transition-colors">
                <span className={`font-bold font-mono text-sm w-10 shrink-0 ${c.color}`}>{c.id}</span>
                <span className="text-sm text(--text-secondary)">{c.description}</span>
              </div>
            ))}
          </div>
        </Panel>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-sm text-(--text-tertiary)">No matching status codes</p>
      )}
    </div>
  );
}
