
document.addEventListener("DOMContentLoaded",() => {

    createSquares();

    const keys = document.querySelectorAll('.keyboard-row button');
    let guessedWords = [[]]
    let availableSpace = 1;
    let word='poop'
    let guessedWordCount = 0;
    var isWinner = false;
    var isLoser = false;


    for (let index = 0; index < keys.length; index++) {
        keys[index].onclick = ({target}) => {

            let letter = target.getAttribute("data-key");
            //console.log(letter);
            if (letter ==='enter'){
                handleSubmitWord();
                return;
            }

            if (letter === 'del'){
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
        }
        
    }

    function handleDeleteLetter(){
        if (isWinner || isLoser){
            return;
        }
        const currrentWordArr = getCurrentWordArr();
        if (currrentWordArr.length !== 0){
            const removedLetter = currrentWordArr.pop();

            guessedWords[guessedWords.length-1] = currrentWordArr;
            const lastLetterEl = document.getElementById(String(availableSpace-1));
            lastLetterEl.textContent = ''
            availableSpace -= 1;
        }


    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords-1];
    }

    function updateGuessedWords(letter){
        const currrentWordArr = getCurrentWordArr();
        //console.log(currrentWordArr);

        if (currrentWordArr && currrentWordArr.length < 4){
            //console.log('pushed!');
            currrentWordArr.push(letter);
            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace += 1;
            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(wordArr,letter,index){
        const isCorrectLetter = word.includes(letter);
        const letterKeyEl = document.getElementById(String(letter));
        if (!isCorrectLetter){
            
            letterKeyEl.style.backgroundColor = "Gray";
            return;
        }
        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = (letterInThatPosition === letter);
        if (isCorrectPosition){
            letterKeyEl.style.backgroundColor = "Green";
            return "Green";
        }
        if (!isCorrectPosition && isCorrectLetter){
            var letterArr = wordArr.filter(w => w === letter);
            var correctLetterArr = word.split('').filter(l => l ===letter);
            if (letterArr.length > correctLetterArr.length){
                return;
            }
        }
        letterKeyEl.style.backgroundColor = "Orange";
        return "Orange";

    }

    function handleSubmitWord(){
        if (isWinner || isLoser){
            return;
        }
        const currrentWordArr = getCurrentWordArr();
        
        if (currrentWordArr.length <4){
            Swal.fire({
                title: 'Try again!',
                text: `The word must be 4 letters.`,
                icon: 'warning',
                confirmButtonText: 'Ok!',
                background: 'lemonchiffon',
                confirmButtonColor: "Orange",
                heightAuto: false
              })
        }
        if (currrentWordArr.length === 4) {
            const firstLetterId = guessedWordCount * 4 +1;
            const interval = 200;
            currrentWordArr.forEach((letter,index)=>{
                setTimeout(()=>{
                    const tileColor = getTileColor(currrentWordArr,letter,index);
                    
                    const letterID = firstLetterId +index;
                    const letterEl = document.getElementById(letterID);
                    letterEl.classList.add("animate__flipInX");
                    letterEl.style = `background-color:${tileColor};border-color:${tileColor}`
                },interval * index);
            });
    
            const currentWord = currrentWordArr.join('');
            guessedWordCount +=1; 
            if (currentWord === word){
                //window.alert("You won! The word is " + word + "!");
                Swal.fire({
                    title: 'Congratulations!',
                    text: `The word is ${word.toUpperCase()}!
                    You got in ${guessedWordCount} out of 6 attempts.`,
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                    background: 'lemonchiffon',
                    confirmButtonColor: "Green",
                    heightAuto: false
                  })
                isWinner = true;
                return;
            }
    
            if (guessedWords.length === 6){
                //window.alert("Sorry, you are out of guesses. Try again tomorrow :(");
                Swal.fire({
                    title: 'Sorry!',
                    text: `You are out of guesses. The word is ${word.toUpperCase()}!`,
                    icon: 'error',
                    confirmButtonText: 'Ok!',
                    background: 'lemonchiffon',
                    confirmButtonColor: "Red",
                    heightAuto: false
                  });
                isLoser = true;

            }
    
            guessedWords.push([]);
        }

    }

    function createSquares(){
        const gameboard= document.getElementById("board")
        for (let index = 0; index < 24; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated")
            square.setAttribute("id", index+1);
            gameboard.appendChild(square);
            
        }
    }
})