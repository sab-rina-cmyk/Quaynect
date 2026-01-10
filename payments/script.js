document.addEventListener('DOMContentLoaded', () => {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    
    // Check if we are on billing page by title or unique element
    // Actually, on billing.html, 'Services' is hardcoded as active.
    // However, if the user clicks other tabs, the JS runs.
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
             // Basic navigation simulation
             const spanText = item.querySelector('span').innerText;
             if(spanText === 'Home') {
                 window.location.href = 'index.html';
                 return; // Let the page load
             }
             // For a real app, you might have other conditions

            // Reset all items: remove active class and ensure outline icon
            navItems.forEach(nav => {
                nav.classList.remove('active');
                const icon = nav.querySelector('ion-icon');
                const name = icon.getAttribute('name');
                // If it's a filled icon (doesn't have -outline) AND it's not a logo/special icon that shouldn't change
                if (name && !name.endsWith('-outline')) {
                    // Try to guess outline name
                    // Check if 'construct' -> 'construct-outline'
                    icon.setAttribute('name', name + '-outline');
                }
            });

            // Set active item: add class and switch to filled icon
            item.classList.add('active');
            const activeIcon = item.querySelector('ion-icon');
            const activeName = activeIcon.getAttribute('name');
            if (activeName && activeName.endsWith('-outline')) {
                activeIcon.setAttribute('name', activeName.replace('-outline', ''));
            }
            
            console.log(`Navigated to: ${spanText}`);
        });
    });

    // RSVP Button
    const rsvpBtn = document.querySelector('.rsvp-btn');
    if (rsvpBtn) {
        rsvpBtn.addEventListener('click', () => {
            rsvpBtn.textContent = 'RSVP Sent!';
            rsvpBtn.style.backgroundColor = '#fff';
            rsvpBtn.style.color = '#333';
            setTimeout(() => {
                rsvpBtn.textContent = 'RSVP';
                rsvpBtn.style.backgroundColor = '';
                rsvpBtn.style.color = '';
            }, 2000);
        });
    }

    // Dashboard Cards Interaction
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h4').innerText;
            console.log(`Open ${title}`);
            
            // Subtle feedback
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // --- Unified Dashboard Logic (Edit & Expand) ---
    const editLink = document.querySelector('.edit-link');
    const expandBtn = document.querySelector('.expand-btn');
    const mainGrid = document.querySelector('.dashboard-section > .grid-container');
    const extraGrid = document.querySelector('.second-grid');
    const expandableWrapper = document.querySelector('.expandable-wrapper');

    let isEditing = false;
    let sortableInstance = null;

    // Helper to get current expansion state visually
    const isExpanded = () => {
        const icon = expandBtn ? expandBtn.querySelector('ion-icon, svg') : null;
        return icon && icon.style.transform === 'rotate(180deg)';
    };

    // Helper to set expansion state
    const setExpanded = (shouldExpand) => {
         if (!expandBtn || !expandableWrapper) return;
         
         const icon = expandBtn.querySelector('ion-icon, svg');
         if (shouldExpand) {
             expandableWrapper.style.maxHeight = expandableWrapper.scrollHeight + "px";
             expandableWrapper.style.opacity = "1";
             if(icon) icon.style.transform = 'rotate(180deg)';
         } else {
             expandableWrapper.style.maxHeight = "0px";
             expandableWrapper.style.opacity = "0";
             if(icon) icon.style.transform = 'rotate(0deg)';
         }
    };

    if (editLink) {
        editLink.addEventListener('click', (e) => {
            e.preventDefault();
            isEditing = !isEditing;
            editLink.textContent = isEditing ? 'DONE' : 'EDIT';

            if (isEditing) {
                // 1. Force Expand visual
                setExpanded(true);

                // 2. Merge items for seamless sorting
                if (extraGrid && mainGrid) {
                    const extraCards = Array.from(extraGrid.children);
                    extraCards.forEach(card => mainGrid.appendChild(card));
                }

                // 3. Init Sortable (Single Grid)
                if (typeof Sortable !== 'undefined' && mainGrid) {
                    sortableInstance = new Sortable(mainGrid, {
                        animation: 300,
                        delay: 0, 
                        touchStartThreshold: 5, // Small threshold to distinguish click/drag
                        forceFallback: true, // CRITICAL: Ensures consistent drag visual across all browsers
                        fallbackClass: 'sortable-drag',
                        ghostClass: 'sortable-ghost',
                        fallbackOnBody: true, // Prevents clipping
                        onStart: (evt) => {
                            evt.item.classList.remove('wiggle');
                            document.body.classList.add('dragging-active');
                        },
                        onEnd: (evt) => {
                            if (isEditing) evt.item.classList.add('wiggle');
                            document.body.classList.remove('dragging-active');
                        }
                    });
                }

                // 4. Start Wiggle
                document.querySelectorAll('.dashboard-card').forEach(c => c.classList.add('wiggle'));

            } else {
                // 1. Stop Wiggle
                document.querySelectorAll('.dashboard-card').forEach(c => c.classList.remove('wiggle'));

                // 2. Destroy Sortable
                if (sortableInstance) {
                    sortableInstance.destroy();
                    sortableInstance = null;
                }

                // 3. Split items back (Maintain 4 in main, rest in extra)
                if (mainGrid && extraGrid) {
                    const allCards = Array.from(mainGrid.children);
                    if (allCards.length > 4) {
                        const cardsToMove = allCards.slice(4);
                        cardsToMove.forEach(card => extraGrid.appendChild(card));
                    }
                }

                // 4. Update wrapper height to match new content flow
                // Since we are still expanded, we just update the explicit height
                if (expandableWrapper) {
                    expandableWrapper.style.maxHeight = expandableWrapper.scrollHeight + "px";
                }
            }
        });
    }

    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            // Check current visual state
            const currentExpanded = isExpanded();
            
            // If we are Editing, we might want to block collapsing? 
            // Or if user collapses while editing, we should probably stop editing?
            // For now, let's allow toggle but it might hide the active sortable items if not careful.
            // BUT: In edit mode, we moved items OUT of the wrapper. So collapsing wrapper does nothing to the last 2 items!
            // This is a side effect of the merge. 
            // FIX: If editing, clicking expand arrow should probably just Exit Edit mode or be ignored.
            // Let's make it exit edit mode for a clean state.
            
            if (isEditing) {
                // Simulate clicking 'Done'
                editLink.click();
                // Then collapse
                setTimeout(() => setExpanded(false), 50);
            } else {
                // Normal toggle behavior
                setExpanded(!currentExpanded);
            }
        });
    }

    // Notification Banner
    const banner = document.querySelector('.notification-banner');
    if (banner) {
        banner.addEventListener('click', () => {
            console.log('Opening notification details');
        });
    }

    // View More Transactions
    const viewMoreBtn = document.querySelector('.view-more');
    const expandableTransactions = document.querySelector('.expandable-transactions');

    if (viewMoreBtn && expandableTransactions) {
        let transactionsExpanded = false;
        viewMoreBtn.addEventListener('click', () => {
            transactionsExpanded = !transactionsExpanded;
            
            // Rotate icon
            const icon = viewMoreBtn.querySelector('ion-icon');
            if(icon) {
                 icon.style.transition = 'transform 0.4s ease';
                 icon.style.transform = transactionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            }
            
            // Animate wrapper
            if (transactionsExpanded) {
                expandableTransactions.style.maxHeight = expandableTransactions.scrollHeight + "px";
                expandableTransactions.style.opacity = "1";
                viewMoreBtn.querySelector('span').textContent = "View Less";
            } else {
                expandableTransactions.style.maxHeight = "0px";
                expandableTransactions.style.opacity = "0";
                viewMoreBtn.querySelector('span').textContent = "View More";
            }
        });
    }
});
