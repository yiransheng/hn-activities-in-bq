'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));

function parseTimestamp(time) {
  time = parseInt(time, 10);
  const timestamp = new Date(time * 1000);
  if (timestamp.toString() === "Invalid Date") {
    throw TypeError(timestamp);
  }
  return timestamp;
}

const HN_API_ROOT = "https://hacker-news.firebaseio.com";
const HN_API_VER = "v0";
const FRONT_PAGE_COUNT = 30;

class HNApiClient {
  constructor() {
    this._axios = axios.create({
      baseURL: `${HN_API_ROOT}/${HN_API_VER}`
    });
  }
  async maxitem() {
    return this._axios.get("/maxitem.json");
  }
  async item(id) {
    const item = await this._axios.get(`item/${id}.json`);
    try {
      return Object.assign(item, {
        time: parseTimestamp(item.time)
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async topstories() {
    const topStoryIds = await this._axios.get("/topstories.json");
    const storyIds = topStoryIds.slice(0, FRONT_PAGE_COUNT);
    const stories = await Promise.all(storyIds.map(id => this.item(id)));
    return stories;
  }
}

const client = new HNApiClient();
client.topstories().then(console.log.bind(console));
