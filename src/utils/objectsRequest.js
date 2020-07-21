import oneObjectRequest from './oneObjectRequest';

export default async (ids) => Promise.all(ids.map((id) => oneObjectRequest(id)));