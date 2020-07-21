import adapter from './adapter';

export default async (id) => {
  try {
    const { data } = await adapter.get(`/item/${id}.json`);
    return data;
  } catch {
    return {};
  }
}