import { raf } from "./utils";

export function updateProgressbar({ event, source, progressBar }) {
  raf(() => {
    const pos =
      (event.pageX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;

    source.currentTime = pos * source.duration;
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
}

export function playPause(mediaElement) {
  if (mediaElement.paused || mediaElement.ended) {
    mediaElement.play();
  } else {
    mediaElement.pause();
  }
}
