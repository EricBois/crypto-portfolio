import React from 'react'
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        backgroundColor: '#FFCD01',
        border: 0,
        borderRadius: '10px',
        color: '#353634',
        maxWidth: '450px',
        margin: '10px auto',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
    },
    btnIcon: {
        justifyContent: 'flex-end',
        color: '#fff',
        height: '5px',
        marginBottom: '-20px',

        '&:hover': {
            color: 'red',
        }
    }
});

export default function Ticker(props) {
    const { coin, deleteTicker, holdings } = props;
    const classes = useStyles();
    const currentHolding = holdings.find(x => x.ticker === coin.id)

    return (

        <Paper className={classes.root}>
            <IconButton disableRipple className={classes.btnIcon} onClick={deleteTicker}><CloseIcon /></IconButton>
            <Box>
                {coin.name}
                </Box>
                <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" sx={{ height: '30px' }}>
                Holdings: {parseFloat(currentHolding.holdings).toFixed(2)}
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" sx={{ height: '30px' }}>
                Current Price: ${parseFloat(coin.price).toFixed(5)}
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" sx={{ height: '30px' }}>
                Asset Value: ${(parseFloat(coin.price) * parseFloat(currentHolding.holdings)).toFixed(2)}
            </Box>
        </Paper>
    )
}
