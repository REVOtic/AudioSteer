(function( $ ) {
	$( document ).ready( function() {
		let $slider = $('input[type="range"]');
		let $frequency = $('input[type="number"]');
		let $channel = $('.channel');

		$slider.rangeslider({
			polyfill: false,
			onInit: function() {
				let $handle = $('.rangeslider__handle', this.$range);
				updateHandle($handle[0], this.value);
			}
		}).on('input', function(e) {
			let $handle = $('.rangeslider__handle', e.target.nextSibling);
			updateHandle($handle[0], this.value);
			// Check the type of slider
			if(this.id.includes("EQ")) {
				let eQNumber = getNumberFromText(this.id);
				$frequency[eQNumber-1].value = this.value;
			} else if(this.id.includes("CH")){
				let chNumber = getNumberFromText(this.id);
				$channel[chNumber-1].value = this.value;
			} else {
				console.log("Unknown Slider!");
			}
		});

		$frequency.on('input', function() {
			let eqNumber = getNumberFromText(this.id);
			let sliderId = '#slider-EQ'+eqNumber;
			$(sliderId).val(this.value).change();
		});

		$channel.on('input', function() {
			let chNumber = getNumberFromText(this.id);
			let sliderId = '#slider-CH'+chNumber;
			$(sliderId).val(this.value).change();
		});

		function updateHandle(el, val) {
			el.textContent = val;
		}

		function getNumberFromText(inputText) {
			return parseInt(inputText.replace(/[^0-9\.]/g, ''), 10);
		}

		$('#saveEQSettings').click(function() {
			// Create a JSON and send the POST Request
			let jsonObj = [];
			$("input[type=range]").each(function() {
				let eq_id = $(this).attr("id").substring(7);
				let eq_value = $(this).val();
		
				item = {}
				item ["eq_name"] = eq_id;
				item ["eq_value"] = eq_value;
		
				jsonObj.push(item);
			});
		
			console.log(JSON.stringify(jsonObj));

			// Requesting POST
			$.ajax({
				type: 'POST',
				url: '/saveConfig',
				data: JSON.stringify(jsonObj),
				contentType: "application/json",
				dataType: 'json',
				success: function(retVal) { 
					alert('Success: ' + JSON.stringify(retVal));
				},
				error: function(err) { 
					console.log('Error: ' + JSON.stringify(err));
				}
			});
		});
	});
} )( jQuery );