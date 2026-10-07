import busArrivalHandler from './bus-arrival.js';

export default async function handler(req, res) {
  return busArrivalHandler(req, res);
}
