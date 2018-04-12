function percent(value) {
    if (!value) {
        return '';
    }
    return (value * 100).toFixed(1) + ' %';
}
export default percent;
