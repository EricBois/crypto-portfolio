import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgba(0, 88, 122, .6)",
    border: 0,
    borderRadius: "10px",
    color: "#fff",
    maxWidth: "450px",
    margin: "0 10px",
  },
  title: {
    textAlign: "center",
  },
  btnDelete: {
    backgroundColor: "#000",
  },
  iconContainer: {
    textAlign: "center",
  },
  imageIcon: {
    height: "50px",
  },
});

export default function Ticker(props) {
  const { coin, deleteTicker, holdings } = props;
  const classes = useStyles();
  const currentHolding =
    holdings.length > 0 ? holdings.find((x) => x.ticker === coin.id) : 0;
  const tradingView = `https://www.tradingview.com/symbols/${coin.id}USDT/`;

  return (
    <div>
      <Card className={classes.root} elevation={5}>
        <CardContent>
          <div className={classes.iconContainer}>
            <Icon>
              <img
                className={classes.imageIcon}
                src={coin.logo_url}
                alt="icon"
              />
            </Icon>
          </div>
          <Typography className={classes.title} variant="h6" gutterBottom>
            {coin.name}
          </Typography>
          <Typography variant="subtitle2">
            Holdings: {parseFloat(currentHolding.holdings).toFixed(2)}
          </Typography>
          <Divider />
          <Typography variant="subtitle2">
            Current Price: ${parseFloat(coin.price).toFixed(5)}
          </Typography>
          <Divider />
          <Typography variant="subtitle2">
            Assets Value: $
            {(
              parseFloat(coin.price) * parseFloat(currentHolding.holdings)
            ).toFixed(2)}
          </Typography>
          <Divider />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            style={{ backgroundColor: "#B8D8D8" }}
            size="small"
            href={tradingView}
            target="_blank"
          >
            TradingView
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#FE5F55" }}
            className="btnDelete"
            size="small"
            onClick={deleteTicker}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
