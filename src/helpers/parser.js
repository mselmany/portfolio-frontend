const definitions = {
  dribbble: {
    title: "?String",
    content: "?String",
    url: "String",
    images: [{ src: "String", title: "?String" }],
    videos: [{ src: "String", title: "?String" }],
    statistics: [{ count: "Int", label: "?LIKE", url: "?String" }]
  }
};
export default function parser(item) {
  const { name, type } = item.__source;
  let __parsed = {};

  switch (name) {
    case "dribbble": {
      __parsed = {
        source: { name, type },
        title: item.title,
        content: item.description,
        url: item.html_url,
        images: [{ src: item.images.hidpi, title: null }],
        videos: null,
        statistics: null
      };
      break;
    }
    case "twitter": {
      __parsed = {
        source: { name, type },
        title: null,
        content: item.text,
        url: item.tweet_url,
        images: null,
        videos: null,
        statistics: [
          { count: item.retweet_count, label: "RETWEET" },
          { count: item.favorite_count, label: "LIKE" }
        ]
      };
      break;
    }

    default:
      __parsed = null;
      break;
  }
  return { ...item, __parsed };
}
