
// Button to get started
var startStreamBtn = document.getElementById('start-stream');
startStreamBtn.addEventListener('click', startStream);

// Output div
var outputDiv = document.getElementById('output');
var streamDiv = function() { return document.getElementById('stream-output') };

// Handle the fetch & response
function startStream(e, url) {
  var url = url || "testdata.txt";
  var msg, state;

  fetch(url).then(response => {

    switch (response.status) {

      case 200:
        state = "success";
        msg = 'Response received!';
        break;

      case 404:
        state = "error";
        msg = 'Sorry, an error occured. The file was not found.';
        break;

      default:
        state = "error";
        msg = 'Sorry, an error occured. http status code: ' + response.status;

    }

    outputDiv.innerHTML += `<p class="${state}">${msg}</p>`;

    if(state === "error")
      return;

    streamResponse(response);

  });
}


// Handle the stream
function streamResponse(response, chunkSize) {

  outputDiv.innerHTML += '<pre id="stream-output"></pre>';
  var html = '';

  var chunkSize = chunkSize || 8;
  var decoder = new TextDecoder();
  var stream = response.body.getReader();

  stream.read().then(function process(result){

    // Stop if finished fetching
    if(result.done) {
      console.log("Fin");
      return;
    }

    // Output HTML `chunkSize` chars at a time
    var data = decoder.decode(result.value);
    //pos = 0;
    //while (pos < data.length) {
      streamDiv().innerHTML += data;
      //pos += chunkSize;
    //}

    // Get some more data and process again
    return stream.read().then(process);
  });


}
