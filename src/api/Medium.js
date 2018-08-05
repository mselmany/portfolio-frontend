import { ApiBase } from "./helpers";
import { required } from "@/helpers";

const USERNAME = "mselmany";
const API_URL = "https://medium.com/@mselmany";
// const API_URL = "https://medium.com/@mselmany/responses?format=json";

class Medium extends ApiBase {
  constructor(username) {
    required({ username });
    super({ baseURL: API_URL });
    this.username = username;
    this.client.interceptors.request.use(
      config => {
        config.url += "?format=json";
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  static parser(name, payload) {
    const type = name.prototype.constructor.name;
    switch (type) {
      case "activities": {
        let { items, prevPageToken, nextPageToken, pageInfo } = payload;
        return {
          type,
          items: items.map(item => ({
            id: item.id,
            videoId: item.contentDetails.playlistItem.resourceId.videoId,
            channel: item.snippet.channelTitle,
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            thumbnails: item.snippet.thumbnails
          })),
          pageInfo,
          ...(prevPageToken && { prevPageToken }),
          ...(nextPageToken && { nextPageToken })
        };
      }

      case "playlistVideos": {
        let { items, prevPageToken, nextPageToken, pageInfo } = payload;
        return {
          type,
          items: items.map(item => ({
            id: item.id,
            videoId: item.contentDetails.videoId,
            channel: item.snippet.channelTitle,
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            thumbnails: item.snippet.thumbnails
          })),
          pageInfo,
          ...(prevPageToken && { prevPageToken }),
          ...(nextPageToken && { nextPageToken })
        };
      }

      case "video": {
        let { id, statistics, snippet, contentDetails } = payload.items[0];
        return {
          type,
          id,
          resulation: contentDetails.definition,
          duration: contentDetails.duration,
          categoryId: snippet.categoryId,
          publishedAt: snippet.publishedAt,
          tags: snippet.tags,
          statistics
        };
      }

      default:
        return payload;
    }
  }

  /*  async latest() {
    try {
      const r = await this.client.get(`/latest`, {
        // headers: { "content-type": "text/plain" }
      });
      // return Medium.parser(this.video, r.data);
      return r;
    } catch (err) {
      console.error(err);
    }
  } */

  async latest() {
    var request = new XMLHttpRequest();
    var url = "https://medium.com/@mselmany/latest";

    return new Promise(resolve => {
      if (request) {
        request.open("GET", url, true);
        request.onreadystatechange = function(data) {
          console.log("XMLHttpRequest: ", data);
          resolve(data);
        };
        request.send();
      }
    });
  }

  async responses() {
    try {
      const r = await this.client.get(`/responses`);
      // return Medium.parser(this.video, r.data);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new Medium(USERNAME);
