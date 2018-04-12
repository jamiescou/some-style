let ua = navigator.userAgent.toLowerCase();
let s;
let t = [
    ua.match(/rv:([\d.]+)\) like gecko/),
    ua.match(/msie ([\d.]+)/),
    ua.match(/firefox\/([\d.]+)/),
    ua.match(/chrome\/([\d.]+)/),
    ua.match(/opera.([\d.]+)/),
    ua.match(/version\/([\d.]+).*safari/)
];
t.map((b)=>{
    if (b) {
        s = b[0];
    }
});
export default s;
