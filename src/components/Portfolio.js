import React, { useState, useEffect, useContext } from 'react'
import FirebaseContext from '../firebase/context';
import Ticker from './Ticker';
import { useFormik } from 'formik';
import validationTickerSchema from './validation/validationTickerSchema';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '90vh'
    },
    paperContainer: {
        minHeight: '600px',
        background: 'rgba(15, 48, 87, .8)',
        paddingBottom: '2rem'
    },
    paperBack: {
        padding: '.8rem .6rem',
        margin: '1rem .7rem',
        background: 'rgba(0, 136, 145, .4)',
        maxWidth: '450px',
    },
    inputs: {
        backgroundColor: 'white'
    },
    refreshBtn: {
        backgroundColor: '#a30303',
        color: '#fff',
        width: '48%',
        marginRight: '5px'
    },
    addBtn: {

    }
}));

var axios = require("axios");

export default function Portfolio(props) {
    const classes = useStyles();
    const { user } = props;
    const { firebase } = useContext(FirebaseContext);
    const [watch, setWatch] = useState([]);
    const [coins, setCoins] = useState([]);
    const [refreshing, setRefresh] = useState(false);

    const formik = useFormik({
        initialValues: {
            ticker: '',
            holdings: ''
        },
        validationSchema: validationTickerSchema,
        onSubmit: (coin, { resetForm }) => {
            setWatch([...watch || [], { holdings: coin.holdings, ticker: coin.ticker.toUpperCase() }])
            resetForm()
        },
    });

    async function deleteTicker(tick) {
        let arr = watch

        const index = arr.findIndex(x => x.ticker === tick)
        if (index > -1) { arr.splice(index, 1) }
        await setWatch(arr)
        await fetchData()
        await saveToDb()
        if (watch.length === 0) setCoins([])
    }

    function getTotals() {
        let total = 0;
        if (watch && coins) {
            for (var i = 0; i < watch.length; i++) {
                for (var x = 0; x < coins.length; x++) {
                    if (watch[i].ticker === coins[x].id) {
                        total += (watch[i].holdings * coins[x].price)
                    }
                }

            }
        }
        return total;

    }

    function saveToDb() {
        firebase.db
            .collection('users')
            .doc(user.uid)
            .update({
                watch,
            });

    }

    // fetch data
    async function fetchData() {
        if (watch.length > 0) {
            // get all coin names
            const coins = watch.map(coin => coin.ticker)
            await axios
                .get("https://api.nomics.com/v1/currencies/ticker?key=" + process.env.REACT_APP_NOMICS_API_KEY + "&ids=" + coins)
                .then(resp => {
                    setCoins(resp.data)
                    // if coin isnt returned by the api , remove from watch list and db
                    if (resp.data.length !== coins.length) {
                        let newArr = watch
                        newArr.pop()
                        setWatch(newArr)
                        saveToDb()
                    }
                })
                .catch(err => {
                    console.log("Error fetching data from nomics", err);
                });
        }
    }

    function refreshData() {
        if (watch && coins) {
            fetchData()
            setRefresh(true)
            setTimeout(() => setRefresh(false), 2000);
        }
    }

    async function getInitialData() {
        firebase.db
            .collection('users')
            .doc(user.uid)
            .get()
            .then((user) => {
                if (user.data()) {
                    setWatch(user.data().watch)
                } else {
                    setWatch([])
                }
            });
    }

    useEffect(() => {
        getInitialData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (watch && watch.length > 0) {
            fetchData()
            saveToDb()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch])

    return (
        <Grid container alignItems="center" justifyContent="center" className={classes.root}>
            <Grid item xs={12} md={10} lg={8}>
            <Paper variant="outlined" className={classes.paperContainer}>
            <Grid container alignItems="center" justifyContent="center" spacing={1} >
                <Grid item xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container justifyContent="center">
                            <Grid item xs={12} align="center">
                                <Paper className={classes.paperBack}>
                                    <TextField
                                        value={formik.values.holdings}
                                        onChange={formik.handleChange}
                                        margin="normal"
                                        label="Holdings"
                                        type="number"
                                        name="holdings"
                                        placeholder="0"
                                        className={classes.inputs}
                                        fullWidth
                                        variant="filled"
                                        error={formik.touched.holdings && Boolean(formik.errors.holdings)}
                                        helperText={formik.touched.holdings && formik.errors.holdings}
                                    />
                                    <TextField
                                        value={formik.values.ticker}
                                        onChange={formik.handleChange}
                                        margin="normal"
                                        label="Ticker  BTC / ADA / ETH ..."
                                        name="ticker"
                                        className={classes.inputs}
                                        fullWidth
                                        variant="filled"
                                        error={formik.touched.ticker && Boolean(formik.errors.ticker)}
                                        helperText={formik.touched.ticker && formik.errors.ticker}
                                    />
                                    {!refreshing ?
                                        <Button
                                            className={classes.refreshBtn}
                                            variant="contained"
                                            onClick={() => refreshData()}
                                        >
                                            Refresh
                                        </Button> :
                                        <Button
                                            style={{ backgroundColor: '#000', color: '#fff', width: '48%', marginRight: '5px' }}
                                            variant="contained"
                                            disabled
                                        >
                                            Done!
                                        </Button>
                                    }
                                    <Button
                                        style={{ backgroundColor: '#4e7a94', color: '#fff', width: '48%' }}
                                        variant="contained"

                                        type="submit"
                                    >
                                        ADD
                                    </Button>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} align="center">
                                <Paper style={{ maxWidth: '400px', margin: '0 10px 5px 10px', fontSize: '25px', padding: '5px', backgroundColor: 'rgba(231, 231, 222, .2)', color: '#f2f2f2' }}>Total Value: <Paper style={{ padding: '2px 8px', display: 'inline-block', backgroundColor: 'rgba(231, 231, 222, 1)' }}>&#36;{getTotals().toFixed(2)}</Paper></Paper>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
                {coins.map((coin) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={coin.id} align="center">
                        <Ticker coin={coin} holdings={watch} deleteTicker={() => deleteTicker(coin.id)} />
                    </Grid>
                ))}
            </Grid>
            </Paper>
            </Grid>
        </Grid>
    )
}
