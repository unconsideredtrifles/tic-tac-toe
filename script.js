let gameBoard = (() => {
    let squares = [
        "", "", "",
        "", "", "",
        "", "", "",
    ];
    let emptySquares = squares.length;

    const showGameResult = () => {
        let gameResultDialog = document.getElementById("game-result-popup");
        gameResultDialog.showModal();
    };

    const getAllSquares = () => squares;
    const tickASquare = (idx, value) => {
        squares[idx] = value;
        emptySquares--;
        if (emptySquares === 0) {
            showGameResult();
        }
    }

    return {
        getAllSquares,
        tickASquare,
    };
})();


let gameBoardUI = ((gameBoard) => {
    let gameBoardSquares = gameBoard.getAllSquares();
    let ticTacToeBoard = document.getElementById("game-board");
    let squaresUI = ticTacToeBoard.children;

    const renderEachSquare = (squareIndex, ticTacToeMark) => {
        squaresUI[squareIndex].textContent = ticTacToeMark;
        gameBoard.tickASquare(squareIndex, ticTacToeMark);
    };

    const render = () => {
        let currentSquareIndex = 0;
        for(let eachSquare of squaresUI) {
            eachSquare.textContent = gameBoardSquares[currentSquareIndex++];
        }
    };

    return {
        renderEachSquare,
        render,
    };
})(gameBoard);


let Player = (name, mark) => {
    let playerName = name;
    let playerMark = mark;
    let totalGamesPlayed = 0;
    let gamesWon = 0;

    const getName = () => playerName;
    const getMark = () => playerMark;
    const playGame = () => ++totalGamesPlayed;
    const winGame = () => ++gamesWin;  
    const getTotalGamesPlayed = () => totalGamesPlayed;
    const getGamesWon = () => gamesWon;

    return {
        getName,
        getMark,
        getGamesWon,
        getTotalGamesPlayed,
        playGame,
        winGame,
    };
};


const players = [Player("Player 1", "O"), Player("Player 2", "X")];

let currentPlayer = ((allPlayers) => {
    let currentPlayerIndex = 0;
    let player = allPlayers[currentPlayerIndex];

    const getMark = () => player.getMark();
    const changePlayer = () => {
        if(currentPlayerIndex >= allPlayers.length - 1) {
            currentPlayerIndex = 0;
        } else {
            currentPlayerIndex++;
        }
        player = allPlayers[currentPlayerIndex];
    };

    return {
        getMark,
        changePlayer,
    }

})(players);


let gameBoardSquares = document.getElementsByClassName("game-board-square");
Array.from(gameBoardSquares).forEach((eachSquare) => {
    eachSquare.addEventListener("click", function () {
        if(this.textContent != "") {
            return;
        }
        let currentSquareIndex = Number(this.getAttribute("data-index"));
        gameBoardUI.renderEachSquare(
            currentSquareIndex,
            currentPlayer.getMark(),
        );
        currentPlayer.changePlayer();
    });
})




