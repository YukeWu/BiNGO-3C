


$(document).ready(function () {
	// pair
	var sequence1 = $('#sequence1');
	var sequence2 = $('#sequence2');
	var s_val = $('#s_val');
	var h_val = $('#h_val');
	var submit = $('#submit');

	// multi
	var sequences = $('#sequences');
	var submit_multi = $('#submit_multi');


	submit.click(pair);
	submit_multi.click(multiple);
});

function pair() {
	// load data
	var sequence1 = $('#sequence1');
	var sequence2 = $('#sequence2');
	var s_val = $('#s_val');
	var h_val = $('#h_val');
	var submit = $('#submit');

	// convert
	var s = parseInt(s_val.val());
	var h = parseInt(h_val.val());

	// processing
	var seq1 = sequence1.val()
	var words1 = splitSeq(seq1, s, h);
	var bins1 = binarize(words1);

	var seq2 = sequence2.val()
	var words2 = splitSeq(seq2, s, h);
	var bins2 = binarize(words2);

	// console.log(seq1.length * 8  )
	// console.log(bins1.length * 8  )


	var s1_len = document.getElementById("s1_len");
	s1_len.innerHTML = seq1.length;
	var s1_nw = document.getElementById("s1_nw");
	s1_nw.innerHTML = words1.length;
	var s1_sb = document.getElementById("s1_sb");
	s1_sb.innerHTML = seq1.length * 8;
	var s1_sa = document.getElementById("s1_sa");
	s1_sa.innerHTML = bins2.length * 8;


	var s2_len = document.getElementById("s2_len");
	s2_len.innerHTML = seq1.length;
	var s2_len = document.getElementById("s2_nw");
	s2_nw.innerHTML = words2.length;
	var s2_sb = document.getElementById("s2_sb");
	s2_sb.innerHTML = seq2.length * 8;
	var s2_sa = document.getElementById("s2_sa");
	s2_sa.innerHTML = bins2.length * 8;


	var cm = intersect(bins1, bins2);
	var cm_wd = document.getElementById("cm_wd");
	cm_wd.innerHTML = cm.length;
	var U = [...new Set([...bins2, ...bins1])]
	var sm_sc = document.getElementById("sm_sc");
	sm_sc.innerHTML = (cm.length / U.length).toFixed(5) * 100;


	var x = document.getElementById("results");
	x.style.display = "block";

	var results_multi = document.getElementById("results_multi");
	results_multi.style.display = "none";
}


// Pair
function multiple() {

	var s_multi = $('#s_multi');
	var h_multi = $('#h_multi');
	var submit_multi = $('#submit_multi');

	// convert
	var s = parseInt(s_multi.val());
	var h = parseInt(h_multi.val());

	var sequencesArray = getSeqs(); //# return a list of sequences
	var all_words = []
	for (let index = 0; index < sequencesArray.length; index++) {
		const sequence = sequencesArray[index]; // for each sequence in the list
		words = splitSeq(sequence, s, h);
		all_words.push(binarize(words));
	}
	console.log(all_words);
	var scores = scores_multi(all_words);
	console.log(scores);
	console.log('all_words.length');
	console.log(sequencesArray.length);
	var mutli_output = makeTriMatrix(scores, sequencesArray.length);
	console.log("scores:" + scores);

	var sm_sc = document.getElementById("content_multi");
	sm_sc.innerHTML = mutli_output;

	var x = document.getElementById("results_multi");
	x.style.display = "block";


	var results1 = document.getElementById("results");
	results1.style.display = "none";

}



// / Multiple sequences processing
function getSeqs() {
	var sequences = $('#sequences');
	var all_sequences = sequences.val();
	// console.log(all_sequences);
	var sequencesArray = all_sequences.split('\n');
	console.log('Input sequences:');
	console.log(sequencesArray);
	return sequencesArray
}

function scores_multi(wordList) {
	var scores = [];
	while (wordList.length > 1) {
		const ref_words = wordList.shift();
		console.log(ref_words)
		for (let index = 0; index < wordList.length; index++) {
			const target_words = wordList[index];
			var I = intersect(ref_words, target_words);
			var U = [...new Set([...ref_words, ...target_words])];
			scores.push(I.length / U.length);
		}
	}
	console.log(scores);
	return scores;
}

// Yuke's Modified Code
function makeTriMatrix(scoresList, Nelement) {
	var index = 0;
	var lines = '';
	var arr = [];
	for (m = 0; m < Nelement; m++) {
		for (n = 0; n < m; n++) {

		}
	}
	for (m = 0; m < Nelement; m++) {
		for (n = 0; n < m; n++) {
			var line = '';
			line += 'Sequence #' + String(m + 1) + ' / ' + 'Sequence #' + String(n + 1) + ' : ' + String(scoresList.shift().toFixed(4))
			console.log("line:" + line)
			arr.push(line);
			lines += line + '<br>';
		}
	}
	getSimilarityMatrix(arr);
	return lines;
}

// Yuke's Added Code
function getSimilarityMatrix(arr) {
	// const fs = require("fs");

	const matrix = {};

	for (let i = 0; i < arr.length; i++) {
		const elements = arr[i].split(" : ");
		const sequences = elements[0].split(" / ");
		const similarity = parseFloat(elements[1]);

		if (!matrix[sequences[0]]) {
			matrix[sequences[0]] = {};
		}

		if (!matrix[sequences[1]]) {
			matrix[sequences[1]] = {};
		}

		matrix[sequences[0]][sequences[1]] = similarity;
		matrix[sequences[1]][sequences[0]] = similarity;
	}

	// Add diagonal elements with a similarity score of 1
	for (const sequence in matrix) {
		matrix[sequence][sequence] = 1;
	}

	console.log(matrix);

	// Convert the similarity matrix to a CSV file
	const csv = [];
	const header = [""];

	// Get the sorted keys
	// const sortedKeys = int(Object.keys(matrix)).sort();
	const sortedKeys = Object.keys(matrix).sort((a, b) => {
		const numA = parseInt(a.match(/\d+/)[0]);
		const numB = parseInt(b.match(/\d+/)[0]);
		return numA - numB;
	  });
	console.log("sortedKeys: " + sortedKeys);
	
	for (const sequence of sortedKeys) {
		header.push([sequence]);
	}

	csv.push(header.join(","));

	// Iterate over the matrix using the sorted keys
	for (const sequence1 of sortedKeys) {
		const row = [sequence1];
		console.log("row: " + row);
		for (const sequence2 of sortedKeys) {
			row.push(matrix[sequence1][sequence2].toFixed(4));
		}

		csv.push(row.join(","));
	}

	const csvData = new Blob([csv.join("\n")], { type: "text/csv" });

	// Create a temporary URL for the CSV file
	const csvUrl = URL.createObjectURL(csvData);

	// Download the CSV file
	const link = document.createElement("a");
	link.href = csvUrl;
	link.download = "similarity-matrix.csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	// Revoke the temporary URL to free up memory
	URL.revokeObjectURL(csvUrl);

}

// pair sequence processing
function splitSeq(seq, s, h) {
	var words = [];
	for (let index = 0; index < seq.length - s; index = index + h) {
		let word = seq.substring(index, index + s);
		words.push(word);
	}
	return words;
}

function binarize(words) {
	let bins = [];
	for (let index = 0; index < words.length; index++) {
		let word = words[index];
		word = word.replaceAll('A', '00').replaceAll('C', '01').replaceAll('G', '10').replaceAll('T', '11');
		bins.push(parseInt(word, 2));
	}
	return [... new Set(bins)]; // as set to get only unique elements

}

function intersect(l1, l2) {
	const filteredArray = l1.filter(value => l2.includes(value));
	return filteredArray;
}
