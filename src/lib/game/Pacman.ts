import { GameBoardItemType, GameDirectionMap, GameDirection, GameDirectionReverseMap, pillMax } from '../Map';
import Item from './Item';

class Pacman extends Item implements GameBoardItem {

  type:GameBoardItemType = GameBoardItemType.PACMAN;

  pursueBiscuit: string | false = false;

  score: number = 0;
  
  // NOTE: Sections below are from the orginal code to allow keyboard movement.

  // constructor(piece:GameBoardPiece, items:GameBoardItem[][], pillTimer:GameBoardItemTimer) {
  //   super(piece, items, pillTimer);

  //   // Bind context for callback events
  //   this.handleKeyPress = this.handleKeyPress.bind(this);

  //   // Add a listener for keypresses for this object
  //   window.addEventListener('keypress', this.handleKeyPress, false);

  // }
   
  
  // /**
  //  * Handle a keypress from the keyboard
  //  * 
  //  * @method handleKeyPress
  //  * @param {KeyboardEvent} e Input event
  //  */

  
  // handleKeyPress(e: KeyboardEvent): void {

  //   if (KeyToGameDirection[e.key.toUpperCase()]) {
  //     this.desiredMove = KeyToGameDirection[e.key.toUpperCase()];
  //   }

  // }
  
  
  // /**
  //  * Returns the next move from the keyboard input
  //  * 
  //  * @method getNextMove
  //  * @return {GameBoardItemMove | boolean} Next move
  //  */

  getNextMove(): GameBoardItemMove | boolean {

    const { moves } = this.piece;
    // moves is an object of possible moves (can't go into walls)

    let seesDanger:boolean = false;
    let dangerAhead:boolean = false;
    let pieceReversed:GameBoardPiece = this.piece;
    let directionReversed:string = GameDirectionMap[this.direction];

    const newMoves:GameBoardItemMoves = {};

    for (const idx in moves) {
      if (idx) {
        const move = moves[idx];
        // only if the next position doesn't have ghost 
        if (this.items[move.y][move.x].type !== GameBoardItemType.GHOST) {

          const ghost = this.findItem(idx, GameBoardItemType.GHOST);
          const biscuit = this.findItem(idx, GameBoardItemType.BISCUIT);
          

          // Checking for ghost
          if (ghost) {
            dangerAhead = true;  
            seesDanger = true;
          }

          // Checking for biscuits, if so eat it
          if (biscuit) {
            this.pursueBiscuit = idx;
            return {piece: move, direction: GameDirectionMap[idx] };
          }

          // Moves toward object if a biscuit, if not turns and goes the other direction
          if (!dangerAhead && GameDirectionMap[GameDirectionReverseMap[idx]] !== this.direction) {
            newMoves[idx] = move;
          } else if (GameDirectionMap[GameDirectionReverseMap[idx]] === this.direction) {
            pieceReversed = move;
            directionReversed = idx;
          }

        }
      }
    }

    // Direction is reversed if danger is seen
    if (seesDanger) {
      newMoves[directionReversed] = pieceReversed;
    }

    // 
    const newMovementIdx = Object.keys(newMoves);

    if (newMovementIdx.length < 1) return false;

    // Trying to increase odds of moving towards a biscuit
    if (this.pursueBiscuit && newMovementIdx.length > 1) {
      if (newMovementIdx.indexOf(this.pursueBiscuit.toString()) !== -1) {
        newMovementIdx.push(this.pursueBiscuit.toString());
      }
      this.pursueBiscuit = false;
    }

    const movePacman = Math.floor(Math.random() * newMovementIdx.length);
    return {piece: newMoves[newMovementIdx[movePacman]], direction: GameDirectionMap[newMovementIdx[movePacman]]};

  }

  /**
   * Move Pacman and "eat" the item
   * 
   * @method move
   * @param {GameBoardPiece} piece 
   * @param {GameDirection} direction 
   */
  move(piece: GameBoardPiece, direction: GameDirection):void {

    const item = this.items[piece.y][piece.x];
    if (typeof item !== 'undefined') {
      this.score += item.type;
      switch(item.type) {
        case GameBoardItemType.PILL:
          this.pillTimer.timer = pillMax;
          break;
        case GameBoardItemType.GHOST:
          if (typeof item.gotoTimeout !== 'undefined')
            item.gotoTimeout();
          break;
        default: break;
      }
    }
    this.setBackgroundItem({ type: GameBoardItemType.EMPTY });
    this.fillBackgroundItem();

    this.setPiece(piece, direction);
    this.items[piece.y][piece.x] = this;
  }

}

export default Pacman;