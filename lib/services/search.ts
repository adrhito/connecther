export interface SearchResults {
  users: Array<{ id: string; name: string; headline?: string; role: string }>;
  jobs: Array<{ id: string; title: string; company_id: string; location: string }>;
  companies: Array<{ id: string; name: string; industry?: string }>;
  communities: Array<{ id: string; name: string; category: string }>;
}

export async function search(query: string): Promise<SearchResults> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  return res.json();
}
