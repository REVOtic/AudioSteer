(function ($) {

	var $window = $(window),
		$body = $('body'),
		$main = $('#main');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Nav.
	var $nav = $('#nav');

	if ($nav.length > 0) {

		// Shrink effect.
		$main
			.scrollex({
				mode: 'top',
				enter: function () {
					$nav.addClass('alt');
				},
				leave: function () {
					$nav.removeClass('alt');
				},
			});

		// Links.
		var $nav_a = $nav.find('a');

		$nav_a
			.scrolly({
				speed: 1000,
				offset: function () { return $nav.height(); }
			})
			.on('click', function () {

				var $this = $(this);

				// External link? Bail.
				if ($this.attr('href').charAt(0) != '#')
					return;

				// Deactivate all links.
				$nav_a
					.removeClass('active')
					.removeClass('active-locked');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
				$this
					.addClass('active')
					.addClass('active-locked');

			})
			.each(function () {

				var $this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
				if ($section.length < 1)
					return;

				// Scrollex.
				$section.scrollex({
					mode: 'middle',
					initialize: function () {

						// Deactivate section.
						if (browser.canUse('transition'))
							$section.addClass('inactive');

					},
					enter: function () {

						// Activate section.
						$section.removeClass('inactive');

						// No locked links? Deactivate all links and activate this section's one.
						if ($nav_a.filter('.active-locked').length == 0) {

							$nav_a.removeClass('active');
							$this.addClass('active');

						}

						// Otherwise, if this section's link is the one that's locked, unlock it.
						else if ($this.hasClass('active-locked'))
							$this.removeClass('active-locked');

					}
				});

			});

	}

	// Scrolly.
	$('.scrolly').scrolly({
		speed: 1000
	});
	
	let limit = 1000;

	let x = 20;
	let data = [];
	let dataSeries = { type: "line" };
	let dataPoints = [];
	let eq_settings = "";
	// $.getJSON("./assets/datadir/eq-settings.json", function (eQdata) {
	$.ajax({
		url: "./assets/datadir/eq-settings.json",
		async: false, 
		success: function(eQdata) {
			eq_settings = eQdata;
			$.each(eQdata, function (key, value) {
				dataPoints.push({
					x: eq_settings[key].frequency,
					y: eq_settings[key].gain
				});
			});
		}
	});
	dataSeries.dataPoints = dataPoints;
	data.push(dataSeries);

	var options = {
		animationEnabled: true,
		zoomEnabled: true,
		zoomType: "xy",
		exportEnabled: true,
		title: {
			text: "Equalizer Setup"
		},
		axisX: {
			logarithmic: true,
			title: "Frequency (Hz)",
			minimum: 20,
			stripLines: [
				{
					value: 100,
				},
				{
					value: 1000,
				},
				{
					value: 10000,
				},
				{
					value: 20000,
				}
			]
		},
		axisY: {
			includeZero: true,
			title: "Gain (dB)"
		},
		data: data 
	};
	$("#chartContainer").CanvasJSChart(options);

})(jQuery);