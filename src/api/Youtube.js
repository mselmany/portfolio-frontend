import { ApiBase } from "./helpers";
import { required } from "@/helpers";

const CHANNEL_ID = "UCqszHejOz5-c05hnUbYskdA";
const YOUTUBE_API_KEY = "?key=AIzaSyCn9LRD1thtmG-wDwkM85ZgkWm9c-JF_Us";
const API_URL = "https://www.googleapis.com/youtube/v3";

class Youtube extends ApiBase {
  constructor(channel_id, api_key) {
    required({ channel_id, api_key });
    super({ baseURL: API_URL });
    this.channel_id = channel_id;
    this.api_key = api_key;
    this.client.interceptors.request.use(
      config => {
        config.url += this.api_key;
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

  async activities({
    limit = this.perpage,
    pageToken,
    publishedBefore,
    publishedAfter
  } = {}) {
    try {
      const r = await this.client.get(`/activities`, {
        params: {
          channelId: this.channel_id,
          part: "snippet,contentDetails",
          fields:
            "etag,items(contentDetails,etag,id,kind,snippet(channelTitle,description,publishedAt,thumbnails(medium,standard),title,type)),kind,nextPageToken,pageInfo,prevPageToken,tokenPagination",
          maxResults: limit,
          ...(pageToken && { pageToken }),
          ...(publishedBefore && { publishedBefore }),
          ...(publishedAfter && { publishedAfter })
        }
      });

      return Youtube.parser(this.activities, r.data);
    } catch (err) {
      console.error(err);
    }
  }

  async playlistVideos({
    playlistId,
    limit = this.perpage,
    pageToken,
    publishedBefore,
    publishedAfter
  } = {}) {
    try {
      required({ playlistId });
      const r = await this.client.get(`/playlistItems`, {
        params: {
          playlistId,
          part: "snippet,contentDetails",
          fields:
            "etag,items(contentDetails,etag,id,kind,snippet(channelTitle,description,publishedAt,thumbnails(medium,standard),title)),kind,nextPageToken,pageInfo,prevPageToken,tokenPagination",
          maxResults: limit,
          ...(pageToken && { pageToken }),
          ...(publishedBefore && { publishedBefore }),
          ...(publishedAfter && { publishedAfter })
        }
      });
      return Youtube.parser(this.playlistVideos, r.data);
    } catch (err) {
      console.error(err);
    }
  }

  async video({ id, videoCategoryId } = {}) {
    try {
      required({ id });
      const r = await this.client.get(`/videos`, {
        params: {
          id,
          part: "snippet,contentDetails,statistics",
          fields:
            "items(contentDetails(definition,duration),id,snippet(categoryId,publishedAt,tags),statistics)",
          ...(videoCategoryId && { videoCategoryId })
        }
      });
      return Youtube.parser(this.video, r.data);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new Youtube(CHANNEL_ID, YOUTUBE_API_KEY);
