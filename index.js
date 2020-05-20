var module = (function () {

	'use strict';

	const hoverColor = '#FFFEDC';
	let currentElementId = '';
	let currentIndex = -1;
	const filteredList = [];
	const data = services.getUserData();	// getting data from the service


	// invoked when the clear button is pressed
	function clearSearchBox () {
		let el = document.getElementById('search-text');
		el.value = '';
		setAllElements();
	}

	// creates and renders all the elements of the data array. Template literal is used to make the code cleaner
	function setAllElements () {
		let cardDiv = document.getElementById('dropdown-card');
		let itemContainerEl = ``;
		for (let i = 0; i < data.length; i++) {
			itemContainerEl += `
				<div class="result-item" id="resultItem-${i}" onmousemove="module.hoveredElement(event)" onkeypress="module.onKeyPress(event)">
					<div class="item-id upper-case">${data[i].id}</div>
					<i>${data[i].name}</i>
					<div class="item-address subtitle-1 margin-small">${data[i].address}</div>
					<div class="item-pin subtitle-1">${data[i].pincode}</div>
					<div class="item-cart subtitle-1">${data[i].items.join(', ')}</div>
				</div>`;
		}
		cardDiv.innerHTML = itemContainerEl;
		return cardDiv;
	}

	// filteres items using the input key. Creates new nodes for the items matching the non-name data
	function setFilteredElements (key) {
		setAllElements();
		let cardDiv = document.getElementById('dropdown-card');
		let list = document.getElementsByClassName('result-item');
		let positiveCount = 0;
		let otherCount = 0;
		for(let i = 0; i < list.length; i++) {
			let nameEl = list[i].getElementsByTagName('i');
			let nameText = nameEl[0].innerText;
			if (nameText.toLowerCase().indexOf(key) >= 0) {
				let extracetdText = nameText.substr(nameText.toLowerCase().indexOf(key), key.length);
				nameEl[0].innerHTML = nameText.replace(extracetdText, `<span style="color: #5a95ed">${extracetdText}</span>`);
				positiveCount++;
				list[i].style.display = '';
			} else {
				list[i].style.display = 'none';
			}
		}
		cardDiv.querySelectorAll('.temp-list-items').forEach(function(node) {
			node.remove();
		});
		let subSectionEl = `
			<div class="temp-list-items" id="partition">
				"${key}" found in items
			</div>`;
		for (let i = 0; i < list.length; i++) {
			let idEl = list[i].getElementsByClassName('item-id');
			let addrEl = list[i].getElementsByClassName('item-address');
			if ((searchById(list[i], key) || searchByAddress(list[i], key) || searchByPin(list[i], key) || searchByItems(list[i], key)) && (list[i].style.display === 'none')) {
				subSectionEl += `
					<div class="temp-list-items" id="tempList-${i}" onmousemove="module.hoveredElement(event)" onkeypress="module.onKeyPress(event)">
						${list[i].innerHTML}
					</div>`;
				otherCount++;
			}
		}
		if (otherCount) {
			cardDiv.innerHTML += subSectionEl;
		}
		if (positiveCount === 0 && otherCount === 0) {
			cardDiv.innerHTML = `<div class="no-data">No User Found</div>`;
		}
		cardDiv.style.display = '';
	}

	function searchById (item, key) {
		let idEl = item.getElementsByClassName('item-id');
		let id = idEl[0].innerText;
		if (id.toLowerCase().indexOf(key) !== -1) {
			let extracetdText = id.substr(id.toLowerCase().indexOf(key), key.length);
			idEl[0].innerHTML = id.replace(extracetdText, `<span style="color: #5a95ed">${extracetdText}</span>`);
			return true;
		}
		return false;
	}

	function searchByAddress (item, key) {
		let addrEl = item.getElementsByClassName('item-address');
		let addr = addrEl[0].innerText;
		if (addr.toLowerCase().indexOf(key) !== -1) {
			let extracetdText = addr.substr(addr.toLowerCase().indexOf(key), key.length);
			addrEl[0].innerHTML = addr.replace(extracetdText, `<span style="color: #5a95ed">${extracetdText}</span>`);
			return true;
		}
		return false;
	}

	function searchByPin (item, key) {
		let pinEl = item.getElementsByClassName('item-pin');
		let pin = pinEl[0].innerText;
		if (pin.toLowerCase().indexOf(key) !== -1) {
			let extracetdText = pin.substr(pin.toLowerCase().indexOf(key), key.length);
			pinEl[0].innerHTML = pin.replace(extracetdText, `<span style="color: #5a95ed">${extracetdText}</span>`);
			return true;
		}
		return false;
	}

	function searchByItems (item, key) {
		let itemsEl = item.getElementsByClassName('item-cart');
		let itemText = itemsEl[0].innerText;
		if (itemText.toLowerCase().indexOf(key) !== -1) {
			let extracetdText = itemText.substr(itemText.toLowerCase().indexOf(key), key.length);
			itemsEl[0].innerHTML = itemText.replace(extracetdText, `<span style="color: #5a95ed">${extracetdText}</span>`);
			return true;
		}
		return false;
	}

	// controller method to handle filtering of data
	function getFilteredItems (event) {
		let elInput = document.getElementById('search-text');
		let key = elInput.value.toLowerCase();
		if (event.which === 40 || event.which === 38 || event.which === 13) {
			onKeyPress(event, key);
		} else {
			currentIndex = -1;
			currentElementId = '';
			if (key === '') {
				setAllElements();
			} else {
				setFilteredElements (key);
			}
		}
	};

	// handle onmousemove event
	function onhoverElement (event) {
		event.stopPropagation();
		let id = 0;
		if (event.target.id) {
			id = event.target.id;
		} else {
			id = event.target.parentElement.id || event.target.parentElement.parentElement.id;
		}

		currentIndex = -2;
		if (currentElementId) {
			document.getElementById(currentElementId).style.backgroundColor = 'initial';
		}
		currentElementId = id;
		document.getElementById(id).style.backgroundColor = hoverColor;
	}

	// handles down arrow key event
	function onKeyPressDown (key) {
		var listElements = [...document.getElementById('dropdown-card').children].filter( item => {
			return item.style.display !== 'none';
		});

		if (currentIndex === -2) {
			let hoveredEl = document.getElementById(currentElementId);
			hoveredEl.backgroundColor = 'initial';
			currentIndex = listElements.findIndex(item => {
				return item.id === hoveredEl.id;
			});
		}

		if (currentIndex !== -1) {
			listElements[currentIndex].style.backgroundColor = 'initial';
		}
		if (currentIndex === -1) {
			currentIndex += 1;
			currentElementId = listElements[currentIndex].id;
			if (currentElementId === 'partition') {
				currentIndex += 1;
				currentElementId = listElements[currentIndex].id;
			}
		} else if (currentIndex === listElements.length - 1){
			currentIndex = 0;
			currentElementId = listElements[currentIndex].id;
			if (currentElementId === 'partition') {
				currentIndex += 1;
				currentElementId = listElements[currentIndex].id;
			}
		} else {
			currentIndex += 1;
			currentElementId = listElements[currentIndex].id;
			if (currentElementId === 'partition') {
				currentIndex += 1;
				currentElementId = listElements[currentIndex].id;
			}
		}

		let el = listElements[currentIndex];
		el.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
		el.style.backgroundColor = hoverColor;
		document.getElementById('search-text').value = el.getElementsByTagName('i')[0].innerText;
	}

	// handles uo arrow key event
	function keyPressUp (key) {
		var listElements = [...document.getElementById('dropdown-card').children].filter( item => {
			return item.style.display !== 'none';
		});

		if (currentIndex === -2) {
			let hoveredEl = document.getElementById(currentElementId);
			hoveredEl.backgroundColor = 'initial';
			currentIndex = listElements.findIndex(item => {
				return item.id === hoveredEl.id;
			});
		}

		if (currentIndex !== -1) {
			listElements[currentIndex].style.backgroundColor = 'initial';
		}

		if (currentIndex === -1 || currentIndex === 0) {
			currentIndex = listElements.length - 1;
			currentElementId = listElements[currentIndex].id;
		} else {
			currentIndex -= 1;
			currentElementId = listElements[currentIndex].id;
			if (currentElementId === 'partition') {
				if (currentIndex === 0) {
					currentIndex = listElements.length - 1;
					currentElementId = listElements[currentIndex].id;
				} else {
					currentIndex -= 1;
					currentElementId = listElements[currentIndex].id;
				}
			}
		}

		let el = listElements[currentIndex];
		el.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
		el.style.backgroundColor = hoverColor;
		document.getElementById('search-text').value = el.getElementsByTagName('i')[0].innerText;
	}

	// subcontroller for keypress events
	function onKeyPress (event, key) {
		if (key === '') setAllElements();
		if (currentIndex === -2 && currentElementId) {
			let el = document.getElementById(currentElementId);
			el.style.backgroundColor = 'initial';
		}
		if (event.which === 40) {
			document.getElementById('dropdown-card').style.display = '';
			onKeyPressDown(key);
		} else if (event.which === 38) {
			document.getElementById('dropdown-card').style.display = '';
			keyPressUp(key);
		} else if (event.which === 13) {
			let el = document.getElementById(currentElementId);
			document.getElementById('search-text').value = el.getElementsByTagName('i')[0].innerText;
			document.getElementById('dropdown-card').style.display = 'none';
		}
	}

	// handler for input box clicks
	function textboxClicked (event) {
		currentElementId = '';
		currentIndex = -1;
		if (document.getElementById('search-text').value !== '') getFilteredItems(event);
	}

	// handles the onblur event on the search box
	function searchBlurred (event) {
		let el = document.getElementById(currentElementId);
		el.style.backgroundColor = 'initial';
		document.getElementById('search-text').value = el.getElementsByTagName('i')[0].innerText;
		document.getElementById('dropdown-card').style.display = 'none';
	}

	// exposing only the required methods.
	return {
		'clearSearchBox': clearSearchBox,
		'getFilteredItems': getFilteredItems,
		'hoveredElement': onhoverElement,
		'onKeyPress': onKeyPress,
		'textboxClicked': textboxClicked,
		'searchBlurred': searchBlurred
	}

})();
