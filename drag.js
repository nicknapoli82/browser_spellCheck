// This section handles the actual spell check of file

// Lets go ahead an load a dictionary into the gloabl objects
// I can't think of a reason not to do this yet, but I may narrow
// scope later 
const VALID_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
		       'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '\''];

class MisspelledData {
    constructor () {
//	this.SPANInsert = `<span id="${currentID}">${word}</span>`;
    }
    
    addWord(word) {
        if (word in Object.keys(this)) {
	    this.word.push( {} ); // What is the data that I need here?
        }
	else { this.word = [ new Word() ]; } // What is the data that I need here?
    }
}

let stickyDict;
let wordsMisspelled = new MisspelledData();
let totalMisspelled = 0;

function Word() {
    this.rawLocation;
    this.HTMLLocation;
    this.ID;
    return this;
}

function loadDict(file) {
    //    let temp = fs.readFileSync(name).toString().split('\n');
    let dict = {};    
    // outputs the content of the text file
    let file_contents = new FileReader();
    file_contents.readAsText(file[0]);
    file_contents.onloadend = function() {
	file_contents = file_contents.result.split('\n');
	while(file_contents.length) {
    	    let t = file_contents.pop();
    	    dict[t] = null;
	}
	console.log(dict);
    };

    document.getElementById('load_dict').style.display = 'none';

    stickyDict = function(word) {
    	if (word in dict) {
    	    return true;
    	}
    	return false;
    };
}

function readWordBuf(buf) {
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

// This is the thing that actually determines what a word is, and passes
// to read_word_buf to be checked. Consider this the main spell check loop
// This function will probably end up being called as an event to allow
// the user to start working on document sooner. Some documents can take
// up to 5 seconds to load. Thats a long time.
function readFile(buf) {

    while(buf.cursor < buf.buffer.length) {
	let word = readWordBuf(buf);
	if (word) {
	    if (!stickyDict(word.toLowerCase())) {
		console.log(word);
		totalMisspelled++;
	    }
	}
    }

    // This will be used lated, just a reminder to myself
    
    // let text = document.createElement('p');
    // text.innerText = reader.result;
    // document.getElementById('doc').appendChild(text);
}


//////////////////////////////////////////////////////////
// This section handles load of text file to be checked //
//////////////////////////////////////////////////////////
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
	readFile( { buffer: reader.result, cursor: 0 } );
    };
}
