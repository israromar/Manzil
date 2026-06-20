type AudioPlayerLike = {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => Promise<void>;
};

export function togglePlayback(player: AudioPlayerLike, isPlaying: boolean) {
  if (isPlaying) {
    player.pause();
    return;
  }
  player.play();
}

export function skipBySeconds(player: AudioPlayerLike, currentTimeSeconds: number, offset: number) {
  return player.seekTo(Math.max(0, currentTimeSeconds + offset));
}
