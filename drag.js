let dropArea = document.getElementById('drop-area');

//['dragenter', 'dragover', 'dragleave',
['dragover', 'drop'].forEach(eventName => {
     dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
}

function handleFiles(files) {
    // files is the array of files obtained
    // only one file should be loaded at a time
    // [TODO]Nick: If more than one file is loaded then let user pick one
    files = [...files];
    files.forEach(previewFile);
}

function previewFile(file) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function() {
	//	let img = document.createElement('img');
	//	img.src = reader.result;
	let text = document.createElement('p');
	text.innerText = reader.result;
	document.getElementById('gallery').appendChild(text);
    };
}

// function dropHandler(ev) {
//     console.log('File(s) dropped');

//     // Prevent default behavior (Prevent file from being opened)
//     ev.stopPropagation();
//     ev.preventDefault();

//     if (ev.dataTransfer.items) {
// 	// Use DataTransferItemList interface to access the file(s)
// 	for (let i = 0; i < ev.dataTransfer.items.length; i++) {
// 	    // If dropped items aren't files, reject them
// 	    if (ev.dataTransfer.items[i].kind === 'file') {
// 		let file = ev.dataTransfer.items[i].getAsFile();
// 		console.log('... file[' + i + '].name = ' + file.name);
// 	    }
// 	}
//     } else {
// 	// Use DataTransfer interface to access the file(s)
// 	for (let i = 0; i < ev.dataTransfer.files.length; i++) {
// 	    console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
// 	}
//     }
// }
