let cardClicked = false;
const inner_container = document.getElementById('inner-container');
const scroll_container = document.getElementById('scroll-container');
const animation_container = document.getElementById('animation-container');
const cards = Array.from(inner_container.children);
const scroll_cards = Array.from(scroll_container.children);
const container = document.getElementById('container');
let totHeight = 0;

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        if (cardClicked) return; // Prevent further clicks

        const clickedIndex = parseInt(card.getAttribute('data-index'));

        // Mark that a card has been clicked
        cardClicked = true;
        document.getElementById('exit-button').style.display = 'flex';

        // Scroll the clicked card into view
        scroll_cards[clickedIndex].scrollIntoView({
            behavior: 'smooth', 
            block: 'start',    
        });

        // Use IntersectionObserver to detect when the scroll animation ends
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Scroll animation finished!');
                    setTimeout(() => {
                        animation_container.style.display = 'none';
                        container.style.opacity = 1;
                    }, 300);
                    // Cleanup
                    observer.disconnect();
                }
            });
        });

        // Observe the clicked card
        observer.observe(scroll_cards[clickedIndex]);

        // Calculate new offsets for each card
        cards.forEach((c, i) => {
            if (i < clickedIndex) {
                // Cards above the clicked card
                const h = c.offsetHeight;
                c.style.setProperty('--offset', `${(i - clickedIndex) * (h + 20)}px`);
            } else if (i === clickedIndex) {
                // The clicked card aligns to the top of the container
                c.style.setProperty('--offset', `0px`);
            } else {
                // Cards below the clicked card
                const h = c.offsetHeight;
                c.style.setProperty('--offset', `${(i - clickedIndex) * (h + 20)}px`);
            }
        });

        // Enable scrolling in the container
        container.style.overflowY = 'scroll';
    });
});

document.getElementById('exit-button').addEventListener('click', () => {

    document.getElementById('exit-button').style.display = 'none';

    // Animated scroll back to the top
    scroll_cards[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });

    // Use IntersectionObserver to detect when the scroll animation ends
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reset the starting style
                animation_container.style.opacity = 0;
                animation_container.style.display = 'block';

                cards.forEach((c, i) => {
                    c.style.setProperty('--offset', `${totHeight + (i * 20)}px`);
                    totHeight = totHeight + c.offsetHeight;
                });

                setTimeout(() => {
                    animation_container.style.opacity = 1;
                    container.style.opacity = 0;

                    cards.forEach((c, i) => {
                        setTimeout(() => {
                            c.style.setProperty('--offset', `${i * 80}px`);
                        }, 300);
                    });
                }, 1000);

                // Cleanup
                observer.disconnect();
            }
        });
    });

    // Observe the first card
    observer.observe(scroll_cards[0]);

    cardClicked = false;
});