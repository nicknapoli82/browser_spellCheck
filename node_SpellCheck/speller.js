var fs = require("fs");

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

let d = fs.readdirSync('../texts');
let words_t = 0;
let words_misspelled = 0;

let check_word = loadDict(`../dictionaries/large`);

for (let f in d) {
    let text_file = read_file_toBuffer(`../texts/${d[f]}`);
    process.stdout.write(`[31mChecking ${d[f]} | [39m`);

    while(text_file.cursor < text_file.buffer.length) {
	let word = read_word_buf(text_file);
	if (word) {
	    if (!check_word(word.toLowerCase())) {
		words_misspelled++;
	    }
	    words_t++;
	}
    }

    console.log("words_misspelled = ", words_misspelled, " | Words_total = ", words_t);
    words_t = 0;
    words_misspelled = 0;
}

//console.log(words_t, words_misspelled);

