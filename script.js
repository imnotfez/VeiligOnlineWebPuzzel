const words = [
    "TIKKIE", "SCAM", "FRAUDE", "BANK", "GELD", "SNEL",
    "OPLICHTER", "NEP", "VERIFICATIE", "IDENTITEIT", "WACHTWOORD",
    "MARKTPLAATS", "BETALING", "SMS", "WHATSAPP", "PINNEN",
    "GELDMAAT", "OVERSTEKEN", "SERVICE", "VALS", "BEROVING",
    "PRINTSCREEN", "KOPIE", "SIMSWAP", "REKENING", "PAS", "BETALEN"
];
const gridSize = 7;
let grid = [];
let selectedCells = [];
let foundWords = new Set();
let isSelecting = false;
let audio = new Audio('./pop.mp3');

function generatePuzzle() {
	grid = Array(gridSize)
		.fill()
		.map(() => Array(gridSize).fill(""));
	const usedWords = [];
	foundWords.clear();

	for (const word of words) {
		if (placeWord(word)) {
			usedWords.push(word);
		}
	}

	fillEmptyCells();
	displayPuzzle();
	displayWords(usedWords);
}

function placeWord(word) {
	const directions = [
		[0, 1],
		[1, 0],
		[1, 1],
		[-1, 1],
		[0, -1],
		[-1, 0],
		[-1, -1],
		[1, -1]
	];

	for (let attempt = 0; attempt < 50; attempt++) {
		const direction = directions[Math.floor(Math.random() * directions.length)];
		const [startX, startY] = [
			Math.floor(Math.random() * gridSize),
			Math.floor(Math.random() * gridSize)
		];

		if (canPlaceWord(word, startX, startY, direction)) {
			placeWordOnGrid(word, startX, startY, direction);
			return true;
		}
	}

	return false;
}

function canPlaceWord(word, startX, startY, [dx, dy]) {
	if (
		startX + dx * (word.length - 1) < 0 ||
		startX + dx * (word.length - 1) >= gridSize ||
		startY + dy * (word.length - 1) < 0 ||
		startY + dy * (word.length - 1) >= gridSize
	) {
		return false;
	}

	for (let i = 0; i < word.length; i++) {
		const [x, y] = [startX + dx * i, startY + dy * i];
		if (grid[y][x] !== "" && grid[y][x] !== word[i]) {
			return false;
		}
	}

	return true;
}

function placeWordOnGrid(word, startX, startY, [dx, dy]) {
	for (let i = 0; i < word.length; i++) {
		const [x, y] = [startX + dx * i, startY + dy * i];
		grid[y][x] = word[i];
	}
}

function fillEmptyCells() {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (let y = 0; y < gridSize; y++) {
		for (let x = 0; x < gridSize; x++) {
			if (grid[y][x] === "") {
				grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
			}
		}
	}
}

function displayPuzzle() {
	const puzzleElement = document.getElementById("puzzle");
	puzzleElement.innerHTML = "";
	for (let y = 0; y < gridSize; y++) {
		for (let x = 0; x < gridSize; x++) {
			const cell = document.createElement("div");
			cell.className = "cell";
			cell.textContent = grid[y][x];
			cell.dataset.x = x;
			cell.dataset.y = y;
			cell.addEventListener("mousedown", startSelection);
			cell.addEventListener("mouseover", updateSelection);
			puzzleElement.appendChild(cell);
		}
	}
	document.addEventListener("mouseup", endSelection);
}

function displayWords(usedWords) {
	const wordsElement = document.getElementById("words");
	wordsElement.innerHTML = "";
	usedWords.forEach((word) => {
		const wordElement = document.createElement("div");
		wordElement.className = "word";
		wordElement.textContent = word;
		wordElement.id = `word-${word}`;
		wordsElement.appendChild(wordElement);
	});
}

function startSelection(e) {
	isSelecting = true;
	selectedCells = [e.target];
	e.target.classList.add("selected");
}

function updateSelection(e) {
	if (!isSelecting) return;

	const cell = e.target;
	if (selectedCells.includes(cell)) return;

	const lastCell = selectedCells[selectedCells.length - 1];
	const [lastX, lastY] = [
		parseInt(lastCell.dataset.x),
		parseInt(lastCell.dataset.y)
	];
	const [currentX, currentY] = [
		parseInt(cell.dataset.x),
		parseInt(cell.dataset.y)
	];

	if (Math.abs(currentX - lastX) <= 1 && Math.abs(currentY - lastY) <= 1) {
		selectedCells.push(cell);
		cell.classList.add("selected");
	}
}

function endSelection() {
	if (!isSelecting) return;

	isSelecting = false;
	const selectedWord = selectedCells.map((cell) => cell.textContent).join("");
	const reversedWord = selectedWord.split("").reverse().join("");

	if (words.includes(selectedWord) || words.includes(reversedWord)) {
		const wordToMark = words.includes(selectedWord) ? selectedWord : reversedWord;
		markWordAsFound(wordToMark);
		selectedCells.forEach((cell) => {
			cell.classList.remove("selected");
			cell.classList.add("found");
		});
	} else {
		selectedCells.forEach((cell) => cell.classList.remove("selected"));
	}

	selectedCells = [];
	checkGameCompletion();
}

function markWordAsFound(word) {
	foundWords.add(word);
	const wordElement = document.getElementById(`word-${word}`);
	if (wordElement) {
		wordElement.classList.add("found");
		audio.play();
		wordElement.style.animation = "celebrate 0.5s ease";
	}
}

function checkGameCompletion() {
    if (foundWords.size === 7) {
        alert("Je hebt gewonnen!");
        document.querySelectorAll(".cell").forEach((cell) => {
            cell.style.animation = "celebrate 0.5s ease infinite";
        });


        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = "./scam.html";
        }, 1000); 
    }
}

generatePuzzle();
