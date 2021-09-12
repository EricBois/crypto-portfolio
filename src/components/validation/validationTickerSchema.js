import * as yup from 'yup';

const validationTickerSchema = yup.object({
  ticker: yup
    .string('Enter a ticker ex ADA or BTC')
    .uppercase('Ticker need to be upercase')
    .required('Ticker is required'),
  holdings: yup
    .string('Enter your holding or 0')
    .required('Value is required'),
});

export default validationTickerSchema;
