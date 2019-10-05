exports.addRankToSongs = songs => {
  return songs.map((s, i) => {
    return {
      ...s,
      rank: i + 1,
    };
  });
};
