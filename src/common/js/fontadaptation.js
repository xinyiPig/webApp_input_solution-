let designWight = 750; // 设计稿weight
let screenWight = document.documentElement.clientWidth;
let fontSize = '';
if (screenWight > designWight) {
    fontSize = 100;
} else {
    fontSize = 100 * (screenWight / designWight);
}
document.documentElement.style.fontSize = fontSize + 'px';
document.documentElement.style.background = '#' + 'ebf1f5';
// document.body.style.paddingBottom = 100 + 'px';
