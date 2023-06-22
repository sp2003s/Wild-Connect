let text = document.getElementById('text');
let leaf = document.getElementById('leaf');
let hill1 = document.getElementById('hill1');
let hill4 = document.getElementById('hill4');
let hill5 = document.getElementById('hill5');

function handleScroll() {
    let value = window.scrollY;

    // Set a limit on the scroll value
    let limit = 700; 

    if (value <= limit) {
        text.style.marginTop = value * 2.5 +'px';
        leaf.style.top = value * -1.5 +'px';
        leaf.style.left = value * 1.5 +'px';
        hill5.style.left = value * 1.5 +'px';
        hill4.style.left = value * -1.5 +'px';
        hill1.style.top = value * 1 +'px';
    }
}

window.addEventListener('scroll', handleScroll);