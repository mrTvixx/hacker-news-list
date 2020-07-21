import adapter from './adapter';

export default async () => {
  try {
    const { data } = await adapter.get('/topstories.json');
    return data;
  } catch {
    return [];
  }
}