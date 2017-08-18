import axios from "axios";
import invariant from "invariant";
import { parseTimestamp } from "./utils";

const HN_API_ROOT = "https://hacker-news.firebaseio.com";
const HN_API_VER = "v0";
const FRONT_PAGE_COUNT = 30;

function validateStoryJSON(item) {
  invariant(item != null, "Recieved Undefined item");
  invariant(typeof item.id === "number", "Invalid item id");
  invariant(item.type === "story", "Item is not a story");
  invariant(typeof item.score === "number", "Invalid item score");
  invariant(typeof item.decendents === "number", "Invalid item decendents count");
  invariant(item.decendents >= 0, "Invalid item decendents count");
}

export class HNApiClient {
  constructor() {
    this._axios = axios.create({
      baseURL: `${HN_API_ROOT}/${HN_API_VER}`
    });
  }
  async maxitem() {
    const { data: maxitem } = this._axios.get("/maxitem.json");
    return maxitem;
  }
  async story(id) {
    const { data: item } = await this._axios.get(`item/${id}.json`);
    try {
      validateStoryJSON(item);
      return Object.assign(item, {
        time: parseTimestamp(item.time)
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
  items(...ids) {
    return Promise.all(ids.map(id => this.item(id)));
  }
  async topstoryIds() {
    const { data: topStoryIds } = await this._axios.get("/topstories.json");
    return topstoryIds;
  }
  async frontpageStories() {
    const topstoryIds = await this.topstoryIds();
    const storyIds = topstoryIds.slice(0, FRONT_PAGE_COUNT);
    const stories = await this.items(...storyIds);
    return stories;
  }
}
