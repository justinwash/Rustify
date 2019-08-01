/* Make table rows selectable */
$(document).ready(function () {
  var artist = $("#artist-name");
  var album = $("#album-title");
  
  $("#queueTable tr").click(function(){
    $(this).addClass('selected').siblings().removeClass('selected');
  });

  $("#queueTable tr").dblclick(function () {    
    $(this).addClass('playing').siblings().removeClass('playing');
    var row = $(this).children();
    $("#song-title").text(row.eq(0).text());
    $("#artist-name").text(row.eq(1).text());
    $("#album-title").text(row.eq(2).text());
    setTimeout(function () {
      rpc.invoke({ cmd: 'play', song: [row.eq(0).text(), row.eq(1).text()] });
    }, 1000);
  });

  $("#browserTable tr").click(function(){
    $(this).addClass('selected').siblings().removeClass('selected');
  });

  $("#browserTable tr").dblclick(function () {
    var value = $(this).find('td:first').html();
    rpc.invoke({ cmd: 'log', text: 'Adding to Queue: ' + value });
  });
});

var rpc = {
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