new Vue({
  el: '#main',
  data: {
    scrubber: 0,
    currentTrack: {
      id: '',
      title: 'Song Title',
      artist: 'Artist Name',
      album: 'Album Title',
      length: 0,
    },
    queue: {
      highlightedTrackId: '',
      tracks: [
        {
          id: '0bnFwEUpPzsfQBz2p4PiR2',
          title: 'Green',
          artist: 'tyedye kye',
          album: 'Color Palettes: Side A',
          length: 201
        },
        {
          id: '0bnFwEUpPzsfQBz2p4PiR1',
          title: 'Green',
          artist: 'tyedye kye',
          album: 'Color Palettes: Side A',
          length: 201
        }
      ]
    },
    rpc: {
      invoke: function (arg) { window.external.invoke(JSON.stringify(arg)); },
      init: function () { rpc.invoke({ cmd: 'init' }); },
      log: function () {
        var s = '';
        for (var i = 0; i < arguments.length; i++) {
          if (i != 0) {
            s = s + ' ';
          }
          s = s + JSON.stringify(arguments[i]);
        }
        rpc.invoke({ cmd: 'log', text: s });
      }
    }
  },
  methods: {
    fancyTimeFormat: function (time) {  
      var hrs = ~~(time / 3600);
      var mins = ~~((time % 3600) / 60);
      var secs = ~~time % 60;
      var ret = "";
      if (hrs > 0) { ret += "" + hrs + ":" + (mins < 10 ? "0" : ""); }
      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
    },
    highlightInQueue: function (id) {
      this.queue.highlightedTrackId = id;
    },
    playFromQueue: function (track) {
      this.currentTrack = track;
      this.rpc.invoke({ cmd: 'play', song: track });
      this.scrubber = 0;
      setInterval(this.incrementScrubber(), 1000);
    },
    incrementScrubber: function () {
      // doesn't work. Threads?
      this.scrubber += 1;
    }
  }
})