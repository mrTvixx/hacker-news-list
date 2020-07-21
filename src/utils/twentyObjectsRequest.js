import objectsRequest from './objectsRequest';

export default async (idsList) => {
  let responses = [];

  for (let i = 0; i < 20; i += 5) {
    const response = await objectsRequest(idsList.slice(i, i + 5))
    responses = [...responses, ...response];
  }

  return responses;
}