$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n');
          publishData(data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});

function publishData(data) {
  console.log(JSON.stringify(data));

  var panel1 = $('<div/>').addClass("panel panel.default");
  var panelB = $('<div/>').addClass("panel-body");
  var table = $('<table/>').attr('id','table1');
  var tableH = $('<thead/>');
  var th = $('<tr/>').append($('<th/>').append("Nome"));
  th.append($('<th/>').append("Percentagem"));
  tableH.append(th);
  table.append(tableH);

  var tb = $('<tbody/>');

  var nomes = ["red", "flower", "flora", "flowering plant", "plant", "garden roses", "rose family", "petal", "fruit", "collard greens", "leaf", "leaf vegetable", "vegetable", "green", "brown"];

  data.forEach(function(element) {
    var aux = 0;
    nomes.forEach(function(nome){
      if(nome == element.name){
        aux = 1;
      }
    })
    if(aux == 0){
      var tr = $("<tr/>");
      tr.append($("<td/>").append(element.name));
      tr.append($("<td/>").append(Math.floor(element.percentage*100)));
      tb.append(tr);
    }

  }, this);
  table.append(tb);

  $('#cenas').append(panel1.append(panelB.append(table)));
  $('#table1').DataTable({bFilter: false, bInfo: false,bPaginate: false});
}
