import { raf } from "./utils";

export function updateProgressbar({ event, source, progressBar, state = {} }) {
  raf(() => {
    const pos =
      (event.pageX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;

    source.currentTime = pos * source.duration;

    if (state && state.currentTime) {
      state.currentTime = source.currentTime;
    }
  });
}

export function changeVolume(mediaElement) {
  if (mediaElement.muted) {
    mediaElement.muted = false;
  } else if (mediaElement.volume <= 0.5) {
    mediaElement.volume = 1;
  } else if (!mediaElement.muted) {
    mediaElement.muted = true;
    mediaElement.volume = 0.5;
  }
  const { muted, volume } = mediaElement;
  return { muted, volume };
}

export function playPause(mediaElement) {
  let playing = null;
  if (mediaElement.paused || mediaElement.ended) {
    mediaElement.play();
    playing = true;
  } else {
    mediaElement.pause();
    playing = false;
  }
  return playing;
}
