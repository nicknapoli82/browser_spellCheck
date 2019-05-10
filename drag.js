// This section handles the actual spell check of file

// Lets go ahead an load a dictionary into the gloabl objects
// I can't think of a reason not to do this yet, but I may narrow
// scope later 
const VALID_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
		       'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '\''];

function loadDict(name) {
    let temp = fs.readFileSync(name).toString().split('\n');
    let dict = {};

    while(temp.length) {
	let t = temp.pop();
	dict[t] = null;
    }
    
    return function(word) {
	if (word in dict) {
	    return true;
	}
	return false;
    };
}

function read_word_buf(buf) {
    let word_found = '';
    while(!VALID_LETTERS.includes(buf.buffer[buf.cursor]) && buf.cursor < buf.buffer.length) {
    	buf.cursor++;
    }
    while(VALID_LETTERS.includes(buf.buffer[buf.cursor])) {
	word_found += buf.buffer[buf.cursor];
	buf.cursor++;
    }
    if (word_found === '') return false;
    return word_found;
}

function read_file_toBuffer(path) {
    // Let try to get a word?
    let test = fs.readFileSync(path);
    return { buffer: test.toString(), cursor: 0 };
}


// This section handles load of text file to be checked
let dropArea = document.getElementById('drop-area');

//['dragenter', 'dragleave'] If you wanna go banannas
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
    files = [...files];
    files.forEach(previewFile);
}

function previewFile(file) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function() {
	let text = document.createElement('p');
	text.innerHTML = reader.result;
	document.getElementById('doc').appendChild(text);
    };
}
