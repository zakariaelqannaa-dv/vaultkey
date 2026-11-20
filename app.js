'use strict';

const CHARACTER_SETS = {
	uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	lowercase: 'abcdefghijklmnopqrstuvwxyz',
	numbers: '0123456789',
	symbols: '!@#$%^&*()-_=+[]{}:,.?'
};
const AMBIGUOUS = new Set(['O', '0', 'I', 'l', '1']);
const COMMON_PASSWORDS = new Set([
	'password', 'password1', 'password123', '123456', '123456789', '12345678', '1234567', '1234567890',
	'qwerty', 'qwerty123', 'qwertyuiop', 'abc123', '111111', '000000', '123123', 'admin', 'admin123',
	'letmein', 'welcome', 'welcome1', 'iloveyou', 'monkey', 'dragon', 'football', 'baseball', 'secret',
	'passw0rd', 'Password1', 'P@ssw0rd', 'changeme', 'user', 'guest', 'root', 'login', 'trustno1'
]);
const COMMON_TERMS = ['password', 'welcome', 'admin', 'letmein', 'qwerty', 'iloveyou', 'monkey', 'dragon', 'football', 'summer', 'winter', 'sunshine', 'princess', 'master'];
const KEYBOARD_PATTERNS = ['qwerty', 'asdf', 'zxcv', 'qaz', 'wsx', '12345', '09876', '1q2w3e', 'qwe123', 'zaq'];

const $ = (selector) => document.querySelector(selector);
const generatedPassword = $('#generated-password');
const generateButton = $('#generate-button');
const lengthSlider = $('#length-slider');
const lengthValue = $('#length-value');
const generatedMeta = $('#generated-meta');
const generatorError = $('#generator-error');
const checkerInput = $('#check-password');
const toast = $('#toast');
let currentPassword = '';
let generatedVisible = true;
let toastTimer = null;

function secureRandomInt(maxExclusive) {
	if (!Number.isSafeInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > 256) {
		throw new RangeError('The random selection range must be between 1 and 256.');
	}
	const limit = Math.floor(256 / maxExclusive) * maxExclusive;
	const bytes = new Uint8Array(1);
	let value;
	do {
		crypto.getRandomValues(bytes);
		value = bytes[0];
	} while (value >= limit);
	return value % maxExclusive;
}

function secureShuffle(items) {
	for (let index = items.length - 1; index > 0; index--) {
		const swapIndex = secureRandomInt(index + 1);
		[items[index], items[swapIndex]] = [items[swapIndex], items[index]];
	}
	return items;
}

function getSelectedSets() {
	const excludeAmbiguous = $('#exclude-ambiguous').checked;
	return Object.entries(CHARACTER_SETS)
		.filter(([key]) => $(`#${key}`).checked)
		.map(([, characters]) => excludeAmbiguous ? [...characters].filter((character) => !AMBIGUOUS.has(character)).join('') : characters)
		.filter((characters) => characters.length > 0);
}

function updateSliderProgress() {
	const min = Number(lengthSlider.min);
	const max = Number(lengthSlider.max);
	const value = Number(lengthSlider.value);
	const progress = ((value - min) / (max - min)) * 100;
	lengthSlider.style.setProperty('--range-progress', `${progress}%`);
	lengthValue.value = String(value);
	lengthValue.textContent = String(value);
}

function generatePassword() {
	generatorError.textContent = '';
	if (!window.crypto || typeof window.crypto.getRandomValues !== 'function') {
		generatorError.textContent = 'Secure password generation is not available in this browser. Open the app in a modern browser.';
		return;
	}
	const selectedSets = getSelectedSets();
	if (selectedSets.length === 0) {
		generatorError.textContent = 'Select at least one character type to generate a password.';
		return;
	}
	const length = Number(lengthSlider.value);
	if (length < selectedSets.length) {
		generatorError.textContent = 'Password length is too short for the selected character types.';
		return;
	}
	const pool = selectedSets.join('');
	const characters = selectedSets.map((set) => set[secureRandomInt(set.length)]);
	while (characters.length < length) characters.push(pool[secureRandomInt(pool.length)]);
	secureShuffle(characters);
	currentPassword = characters.join('');
	generatedVisible = true;
	renderGeneratedPassword();
	generatedMeta.textContent = `${length} characters · ${selectedSets.length} character ${selectedSets.length === 1 ? 'type' : 'types'}`;
	$('#toggle-generated').setAttribute('aria-label', 'Hide password');
	$('#toggle-generated').title = 'Hide password';
	$('#copy-feedback').textContent = '';
}

function renderGeneratedPassword() {
	generatedPassword.textContent = generatedVisible ? currentPassword : '•'.repeat(currentPassword.length);
}

function showToast(message) {
	toast.textContent = message;
	toast.classList.add('visible');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

async function copyText(value, feedbackElement) {
	if (!value) return;
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(value);
		} else {
			const temporary = document.createElement('textarea');
			temporary.value = value;
			temporary.setAttribute('readonly', '');
			temporary.style.position = 'fixed';
			temporary.style.opacity = '0';
			document.body.appendChild(temporary);
			temporary.select();
			const copied = document.execCommand('copy');
			temporary.remove();
			if (!copied) throw new Error('Clipboard copy was blocked.');
		}
		if (feedbackElement) feedbackElement.textContent = 'COPIED';
		showToast('Password copied to clipboard');
	} catch (error) {
		if (feedbackElement) feedbackElement.textContent = 'COPY BLOCKED';
		showToast('Clipboard access was blocked by the browser');
	}
}

function hasSequentialRun(password) {
	const value = password.toLowerCase();
	for (let index = 0; index <= value.length - 4; index++) {
		const part = value.slice(index, index + 4);
		if (!/^(?:[a-z]{4}|\d{4})$/.test(part) || /^(.)\1{3}$/.test(part)) continue;
		let ascending = true;
		let descending = true;
		for (let offset = 1; offset < part.length; offset++) {
			const difference = part.charCodeAt(offset) - part.charCodeAt(offset - 1);
			if (difference !== 1) ascending = false;
			if (difference !== -1) descending = false;
		}
		if (ascending || descending) return true;
	}
	return false;
}

function inspectPassword(password) {
	const lower = password.toLowerCase();
	const lengthPass = password.length >= 12;
	const types = [/[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
	const varietyPass = types >= 3;
	const uniqueRatio = password.length ? new Set(password).size / password.length : 0;
	const repeatedRun = /(.)\1{2,}/.test(password);
	const repeatedChunk = /(.{1,3})\1{2,}/i.test(password);
	const uniquePass = uniqueRatio >= 0.55 && !repeatedRun && !repeatedChunk;
	const hasKeyboardPattern = KEYBOARD_PATTERNS.some((pattern) => lower.includes(pattern));
	const hasSequence = hasSequentialRun(password);
	const hasCommonTerm = COMMON_TERMS.some((term) => lower.includes(term));
	const hasYearOrSimpleSuffix = /(19|20)\d{2}$/.test(password);
	const patternsPass = !hasKeyboardPattern && !hasSequence && !repeatedRun && !hasYearOrSimpleSuffix;
	const commonPass = !COMMON_PASSWORDS.has(password) && !hasCommonTerm;
	const commonExact = COMMON_PASSWORDS.has(password);

	let score = 0;
	if (password.length >= 8) score += 15;
	if (password.length >= 12) score += 15;
	if (password.length >= 16) score += 15;
	if (password.length >= 20) score += 10;
	if (password.length >= 28) score += 5;
	score += Math.min(types, 4) * 8;
	score += Math.round(uniqueRatio * 12);
	if (repeatedRun) score -= 18;
	if (repeatedChunk) score -= 15;
	if (hasKeyboardPattern) score -= 20;
	if (hasSequence) score -= 12;
	if (hasCommonTerm) score -= 20;
	if (hasYearOrSimpleSuffix) score -= 8;
	if (commonExact) score = 0;
	score = Math.max(0, Math.min(100, Math.round(score)));
	if (password.length < 8) score = Math.min(score, 20);

	let level = 'weak';
	let label = 'Weak';
	let caption = 'Easy to guess';
	if (score >= 82 && password.length >= 16 && commonPass && patternsPass && uniquePass) {
		level = 'excellent'; label = 'Excellent'; caption = 'Good resistance indicators';
	} else if (score >= 62 && password.length >= 12 && commonPass) {
		level = 'strong'; label = 'Strong'; caption = 'A solid starting point';
	} else if (score >= 35) {
		level = 'fair'; label = 'Fair'; caption = 'Room to improve';
	}
	if (!password) {
		return { empty: true };
	}
	return {
		score, level, label, caption,
		checks: { length: lengthPass, variety: varietyPass, unique: uniquePass, patterns: patternsPass, common: commonPass },
		commonExact, hasCommonTerm, hasKeyboardPattern, hasSequence, repeatedRun, repeatedChunk,
		length: password.length, types, uniqueRatio
	};
}

function getRecommendations(result) {
	if (result.empty) return 'Enter a password to see tailored ways to improve it.';
	const suggestions = [];
	if (result.commonExact || result.hasCommonTerm) suggestions.push('Avoid familiar words or commonly used passwords');
	if (result.length < 16) suggestions.push('Use at least 16 characters');
	if (result.types < 3) suggestions.push('Mix at least three character types');
	if (result.repeatedRun || result.repeatedChunk) suggestions.push('Remove repeated characters or chunks');
	if (result.hasKeyboardPattern || result.hasSequence) suggestions.push('Avoid keyboard paths and sequential characters');
	if (result.length >= 16 && result.types >= 3 && result.checks.unique && result.checks.patterns && result.checks.common) {
		suggestions.push('This looks good by the local checks; use it for one account only');
	}
	if (suggestions.length === 0) suggestions.push('Add length and unpredictability; a longer unique password is usually better');
	return suggestions.slice(0, 2).join('. ') + (suggestions.length === 1 ? '.' : '.');
}

function renderStrength() {
	const password = checkerInput.value;
	const result = inspectPassword(password);
	const label = $('#strength-label');
	const caption = $('#strength-caption');
	const score = $('#strength-score');
	const fill = $('#strength-fill');
	const meter = $('#strength-meter');
	const recommendation = $('#recommendation p');

	if (result.empty) {
		label.textContent = 'Waiting for input';
		caption.textContent = 'Enter a password to begin';
		score.textContent = '—';
		fill.style.width = '0%';
		meter.dataset.level = '';
		meter.setAttribute('aria-valuenow', '0');
		recommendation.textContent = getRecommendations(result);
		updateCheckItem('length', null);
		updateCheckItem('variety', null);
		updateCheckItem('unique', null);
		updateCheckItem('patterns', null);
		updateCheckItem('common', null);
		return;
	}

	label.textContent = result.label;
	caption.textContent = result.caption;
	score.textContent = `${result.score} / 100`;
	fill.style.width = `${result.score}%`;
	meter.dataset.level = result.level;
	meter.setAttribute('aria-valuenow', String(result.score));
	Object.entries(result.checks).forEach(([key, passed]) => updateCheckItem(key, passed));
	recommendation.textContent = getRecommendations(result);
}

function updateCheckItem(key, passed) {
	const item = $(`[data-check="${key}"]`);
	item.classList.remove('pass', 'fail', 'pending');
	const icon = item.querySelector('.check-icon');
	if (passed === null) {
		item.classList.add('pending');
		icon.textContent = '–';
	} else if (passed) {
		item.classList.add('pass');
		icon.textContent = '✓';
	} else {
		item.classList.add('fail');
		icon.textContent = '!';
	}
}

function toggleVisibility(input, button, showLabel, hideLabel) {
	const reveal = input.type === 'password';
	input.type = reveal ? 'text' : 'password';
	button.setAttribute('aria-label', reveal ? hideLabel : showLabel);
	button.title = reveal ? hideLabel : showLabel;
}

lengthSlider.addEventListener('input', updateSliderProgress);
lengthSlider.addEventListener('change', generatePassword);
['uppercase', 'lowercase', 'numbers', 'symbols', 'exclude-ambiguous'].forEach((id) => {
	$(`#${id}`).addEventListener('change', generatePassword);
});
generateButton.addEventListener('click', generatePassword);
$('#copy-generated').addEventListener('click', () => copyText(currentPassword, $('#copy-feedback')));
$('#toggle-generated').addEventListener('click', () => {
	generatedVisible = !generatedVisible;
	renderGeneratedPassword();
	$('#toggle-generated').setAttribute('aria-label', generatedVisible ? 'Hide password' : 'Show password');
	$('#toggle-generated').title = generatedVisible ? 'Hide password' : 'Show password';
});
$('#toggle-check').addEventListener('click', () => toggleVisibility(checkerInput, $('#toggle-check'), 'Show password', 'Hide password'));
checkerInput.addEventListener('input', renderStrength);

updateSliderProgress();
generatePassword();
renderStrength();
