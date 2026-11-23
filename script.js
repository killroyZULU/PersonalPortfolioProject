(() => {
	'use strict';

	function initializePortfolio() {
		const root = document.documentElement;
		const themeButton = document.querySelector('[data-theme-toggle]');
		const menuButton = document.querySelector('[data-menu-toggle]');
		const navigation = document.querySelector('#primary-navigation');

		// Persist the selected theme when browser storage is available.
		let theme;
		try {
			theme = localStorage.getItem('portfolio-theme');
		} catch (_) {
			// Storage may be disabled; theme switching still works for this visit.
		}
		if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;

		const updateThemeControl = () => {
			if (!themeButton) return;
			const dark = root.dataset.theme === 'dark';
			themeButton.textContent = dark ? '☀' : '☾';
			themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
		};
		updateThemeControl();

		themeButton?.addEventListener('click', () => {
			const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
			root.dataset.theme = nextTheme;
			try {
				localStorage.setItem('portfolio-theme', nextTheme);
			} catch (_) {
				// Ignore unavailable storage.
			}
			updateThemeControl();
		});

		const closeNavigation = () => {
			if (!menuButton || !navigation) return;
			menuButton.setAttribute('aria-expanded', 'false');
			menuButton.setAttribute('aria-label', 'Open navigation');
			navigation.classList.remove('is-open');
		};

		menuButton?.addEventListener('click', () => {
			if (!navigation) return;
			const open = menuButton.getAttribute('aria-expanded') !== 'true';
			menuButton.setAttribute('aria-expanded', String(open));
			menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
			navigation.classList.toggle('is-open', open);
		});
		navigation?.addEventListener('click', event => {
			if (event.target.closest('a')) closeNavigation();
		});
		document.addEventListener('keydown', event => {
			if (event.key === 'Escape' && navigation?.classList.contains('is-open')) {
				closeNavigation();
				menuButton?.focus();
			}
		});
		window.addEventListener('resize', () => {
			if (window.innerWidth > 760) closeNavigation();
		});

		const filters = document.querySelectorAll('[data-filter]');
		const cards = document.querySelectorAll('.project-card');
		filters.forEach(button => {
			button.addEventListener('click', () => {
				const selected = button.dataset.filter;
				filters.forEach(filter => {
					filter.setAttribute('aria-pressed', String(filter === button));
				});
			cards.forEach(card => {
					card.hidden = selected !== 'all' && card.dataset.category !== selected;
				});
			});
		});

		const form = document.querySelector('[data-contact-form]');
		form?.addEventListener('submit', event => {
			event.preventDefault();
			if (!form.reportValidity()) return;

			const status = form.querySelector('.form-status');
			if (status) {
				status.textContent = 'Thanks! This demo form is not connected to a submission service yet.';
			}
		});

		const year = document.querySelector('[data-year]');
		if (year) year.textContent = new Date().getFullYear();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initializePortfolio, { once: true });
	} else {
		initializePortfolio();
	}
})();
