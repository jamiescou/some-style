function currency(val = {}) {
    let { symbol, value = '0' } = val;

    if (!symbol || !value) {
        return ' ';
    }

    return `${symbol} ${value}`;
}
export default currency;
