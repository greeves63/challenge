import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { tic } from '../../redux/actions';
import GameBoard from './Board';
import { GameMode } from '../../lib/Map';
import Controls from './Controls';

interface GameProps {
  dispatch: Function;
  layout?: GameBoardPiece[][];
  score?: number,
  mode?: GameMode,
  runningScore?: number,
  iteration?: number,
  testMode?: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  base: {
    marginBottom: theme.spacing(2),
  },
}));

const Game: React.FC<GameProps> = ({ dispatch, layout, score, runningScore, iteration, testMode }): JSX.Element => {
  
  const styles = useStyles({});

  useEffect(() => {
    setInterval(() => {dispatch(tic());}, testMode ? 10 : 250);
  }, [dispatch, testMode]);
  
  return (
    <Grid container alignContent="center" justify="center" className={styles.base} spacing={3}>
      <Grid item>
        <GameBoard boardState={layout} />
      </Grid>
      <Grid item>
        <Controls score={score} runningScore={runningScore} iteration={iteration} testmode={testMode} />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state: ReduxState): object => {
 
  const { layout, PacmanStore, runningScore, iteration, testMode } = state.game;

  const score = typeof PacmanStore !== 'undefined' ? PacmanStore.score : 0;

  return { layout, score, runningScore, iteration, testMode };
};

export default connect(mapStateToProps)(Game);