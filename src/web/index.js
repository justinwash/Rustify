/* Make table rows selectable */
$(document).ready(function() {
  $("#queueTable tr").click(function(){
    $(this).addClass('selected').siblings().removeClass('selected');
  });

  $("#queueTable tr").dblclick(function () {    
    $(this).addClass('playing').siblings().removeClass('playing');
    var value = $(this).find('td:first').html();
    rpc.invoke({ cmd: 'log', text: 'Playing: ' + value });
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