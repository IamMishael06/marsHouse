var loader = document.getElementById('loading');

// Function to show loader
function showLoader() {
    loader.style.display = 'flex'; 
    setTimeout(() => {
        window.location.assign('price.html');
    },6000);
}
