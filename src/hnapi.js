import axios from "axios";
import { parseTimestamp } from "./utils";

const HN_API_ROOT = "https://hacker-news.firebaseio.com";
const HN_API_VER = "v0";
const FRONT_PAGE_COUNT = 30;

export class HNApiClient {
  constructor() {
    this._axios = axios.create({
      baseURL: `${HN_API_ROOT}/${HN_API_VER}`
    });
  }
  maxitem() {
    return this._axios.get("/maxitem.json");
  }
  item(id) {
    const item = await this._axios.get(`item/${id}.json`);
    try {
      return { ...item, time: parseTimestamp(item.time) };
    } catch (err) {
      return Promise.reject(err);
    }
  }
  topstories() {
    const topStoryIds = await this._axios.get("/topstories.json")
    const storyIds = topStoryIds.slice(0, FRONT_PAGE_COUNT);
    const stories = await Promise.all(storyIds.map(id => this.item(id)));
    return stories;
  }
}
