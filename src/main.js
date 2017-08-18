import { HNApiClient } from "./hnapi";

const client = new HNApiClient();
client.topstories().then(console.log.bind(console));
