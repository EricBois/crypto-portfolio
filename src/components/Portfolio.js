import React, { useState, useEffect, useContext } from 'react'
import FirebaseContext from '../firebase/context';
import Ticker from './Ticker';
import { useFormik } from 'formik';
import validationTickerSchema from './validation/validationTickerSchema';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

var axios = require("axios");

export default function Portfolio(props) {
    const { user } = props;
    const { firebase } = useContext(FirebaseContext);
    const [watch, setWatch] = useState([])
    const [coins, setCoins] = useState([])

    const formik = useFormik({
        initialValues: {
            ticker: '',
            holdings: '0'
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
        // get all coin names
        const coins = watch.map(coin => coin.ticker)
        // const url = "https://api.nomics.com/v1/currencies/ticker?key=" + process.env.REACT_APP_NOMICS_API_KEY + "&ids=" + coins
        await axios
            .post(`/api/getTicker`, coins)
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

    async function getInitialData() {
        firebase.db
            .collection('users')
            .doc(user.uid)
            .get()
            .then((user) => {
                setWatch(user.data().watch)
            });
    }

    useEffect(() => {
        if (watch && watch.length > 0) {
            fetchData()
            saveToDb()
        } else {
            getInitialData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch])

    return (
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
            <Grid item xs={12}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container justifyContent="center">
                        <Grid item xs={10} sm={6} md={4} lg={3}>
                            <TextField
                                value={formik.values.holdings}
                                onChange={formik.handleChange}
                                margin="normal"
                                label="Holdings"
                                name="holdings"
                                fullWidth
                                variant="outlined"
                                error={formik.touched.holdings && Boolean(formik.errors.holdings)}
                                helperText={formik.touched.holdings && formik.errors.holdings}
                            />
                            <TextField
                                value={formik.values.ticker}
                                onChange={formik.handleChange}
                                margin="normal"
                                label="Ticker  BTC / ADA / ETH ..."
                                name="ticker"
                                fullWidth
                                variant="outlined"
                                error={formik.touched.ticker && Boolean(formik.errors.ticker)}
                                helperText={formik.touched.ticker && formik.errors.ticker}
                            />
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                            >
                                ADD
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            {coins.map((coin) => (
                <Grid item xs={12} md={8} key={coin.id}>
                    <Ticker coin={coin} holdings={watch} deleteTicker={() => deleteTicker(coin.id)} />
                </Grid>
            ))}
        </Grid>
    )
}
