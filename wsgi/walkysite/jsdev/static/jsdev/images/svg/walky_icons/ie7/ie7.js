/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referring to this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'walky_icons\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-distance': '&#xe600;',
		'icon-download': '&#xe601;',
		'icon-favourite': '&#xe602;',
		'icon-finish': '&#xe603;',
		'icon-like': '&#xe604;',
		'icon-location': '&#xe605;',
		'icon-share': '&#xe606;',
		'icon-start': '&#xe607;',
		'icon-time': '&#xe608;',
		'icon-user': '&#xe609;',
		'icon-envelope': '&#xe60a;',
		'icon-location2': '&#xe60b;',
		'icon-clock': '&#xe60c;',
		'icon-user2': '&#xe613;',
		'icon-key': '&#xe60d;',
		'icon-key2': '&#xe60e;',
		'icon-lock': '&#xe60f;',
		'icon-share2': '&#xe610;',
		'icon-foursquare': '&#xe611;',
		'icon-foursquare2': '&#xe612;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
