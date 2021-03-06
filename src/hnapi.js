import axios from "axios";
import invariant from "invariant";
import { parseTimestamp } from "./utils";
import { getRank } from "./stats";

const HN_API_ROOT = "https://hacker-news.firebaseio.com";
const HN_API_VER = "v0";
const FRONT_PAGE_COUNT = 30;

function validateItemJSON(item) {
  invariant(item != null, "Recieved Undefined item");
  invariant(typeof item.id === "number", "Invalid item id");
  invariant(typeof item.score === "number", "Invalid item score");
  if (item.type === "story") {
    invariant(
      typeof item.descendants === "number",
      "Invalid item descendants count"
    );
    invariant(item.descendants >= 0, "Invalid item descendants count");
  }
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
      validateItemJSON(item);
      return Object.assign(item, {
        time: parseTimestamp(item.time)
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async stories(...ids) {
    const items = await Promise.all(ids.map(id => this.story(id)));
    return items.filter(s => s.type === "story");
  }
  async topitemIds() {
    // ids returned from this endpoint may contain "job" type of item
    // we are not interested in these
    const { data: topitemIds } = await this._axios.get("/topstories.json");
    return topitemIds;
  }
  async frontpageStories() {
    const topitemIds = await this.topitemIds();
    const storyIds = topitemIds.slice(0, FRONT_PAGE_COUNT);
    const stories = await this.stories(...storyIds);
    return stories.map(s =>
      Object.assign(s, { rank: getRank(topitemIds, s.id) })
    );
  }
}
