function createBoard () {
    let board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];

    const placeToken = function (playerToken, row, col) {
        if(row >= 0 && row < board.length && col >= 0 && col < board[0].length)
        {
            if(board[row][col] === " ")
            {
                board[row][col] = playerToken;
                return true;
            }
        }

        return false;
    }

    const getLocationPlayer = function (row, col) {
        return board[row][col];
    }

    const getBoardRowsSize = function () {
        return board.length;
    }

    const getBoardColSize = function () {
        return board[0].length;
    }

    const validLines = [
        [
            [0, 0],
            [1, 1],
            [2, 2]
        ],
        [
            [0, 2],
            [1, 1],
            [2, 0]
        ]
    ];

   //Add row lines
   for(let row = 0; row < board.length; row++)
   {
        validLines.push([
            [row, 0],
            [row, 1],
            [row, 2]
        ]);
   }
   //Add col lines
   for(let col = 0; col < board[0].length; col++)
   {
        validLines.push([
            [0, col],
            [1, col],
            [2, col]
        ]);
   }

   const checkThreeInARow = function () {
        for (const line of validLines)
        {
            const boxOnePlayer = board[line[0][0]][line[0][1]];
            const boxTwoPlayer = board[line[1][0]][line[1][1]];
            const boxThreePlayer = board[line[2][0]][line[2][1]];

            if(boxOnePlayer !== " " && boxOnePlayer === boxTwoPlayer && boxTwoPlayer === boxThreePlayer)
                return true;
        }

        return false;
    }

    return {placeToken, getLocationPlayer, checkThreeInARow, getBoardRowsSize, getBoardColSize};
}


function createPlayer(player, playerToken) {
    const playerNumber = player;
    const token = playerToken;

    return {playerNumber, token};
}

function createGame() {
   const player1 = createPlayer(1, 'X'); 
   const player2 = createPlayer(2, 'O');
   const board = createBoard();
    
   let currentPlayer = player1;

   let continueGame = true;
   let winner = 0;

   const takeTurn = function (row, col) {
        if(continueGame)
        {
            if(!board.placeToken(currentPlayer.token, row, col))
                //avoid changing players if invalid move
                return true;

            let threeInARow = board.checkThreeInARow();

            if (threeInARow)
            {
                winner = currentPlayer.playerNumber;
                continueGame = false;
                return continueGame;
            }
            
            if(currentPlayer === player1)
                currentPlayer = player2;
            else if(currentPlayer === player2)
                currentPlayer = player1;


            return continueGame; 
        }
        else
        {
            return false;
        }
   }

   const getWinner = () => winner;
   const getCurrentPlayer = () => currentPlayer;

   return {takeTurn, getCurrentPlayer, getWinner, board};
}

function consoleDisplayBoard(game) {
    const boardRows = game.board.getBoardRowsSize();
    const boardCols = game.board.getBoardColSize();
    
    console.log('-------');
    
    for(let row = 0; row < boardRows; row++)
    {
        let rowString = row + "|";
        for(let col = 0; col < boardCols; col++)
        {
            rowString += game.board.getLocationPlayer(row, col) + '|';
        }

        console.log(rowString);
    }
    console.log('-------');
}

function displayHtmlBoard(board) {
    const boardRows = board.getBoardRowsSize();
    const baordCols = board.getBoardColSize();

    for(let row = 0; row < boardRows; row++)
    {
        for(let col = 0; col < baordCols; col++)
        {
            const box = document.querySelector(".box" + row + "_" + col);
            box.textContent = board.getLocationPlayer(row, col);
        }
    }
}

function updateCurrentPlayerDisplay(playerNumber) {
    const playerOutput = document.querySelector(".current_player");
    playerOutput.textContent = playerNumber;
}

function boxClicked(e) {
    const box = e.target.className.split(" ")[1].substring(3).split("_");
    console.log(box);
    tictactoe.takeTurn(box[0], box[1]);
    displayHtmlBoard(tictactoe.board);
    updateCurrentPlayerDisplay(tictactoe.getCurrentPlayer().playerNumber);

    if(tictactoe.getWinner() !== 0)
    {
        const current_player_display = document.querySelector('.current_player_container');
        current_player_display.innerHTML = "";
        current_player_display.textContent = "Player " + tictactoe.getCurrentPlayer().playerNumber + " Wins!";
    }
}

function addClickEventToBoxes(board) {
    const boardRows = board.getBoardRowsSize();
    const baordCols = board.getBoardColSize();

    for(let row = 0; row < boardRows; row++)
    {
        for(let col = 0; col < baordCols; col++)
        {
            const box = document.querySelector(".box" + row + "_" + col);
            box.addEventListener('click', boxClicked);
        }
    }
}


let tictactoe = createGame();
addClickEventToBoxes(tictactoe.board);
updateCurrentPlayerDisplay(tictactoe.getCurrentPlayer().playerNumber);
