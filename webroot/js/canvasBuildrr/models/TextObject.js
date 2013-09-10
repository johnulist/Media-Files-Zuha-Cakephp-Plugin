var TextObject = Backbone.Model.extend({
	defaults: {
		type: 'text',
		content: '',
		fontFamily: 'Arial',
		fontColor: '#333333',
		fontSize: 16,
		width: '',
		x: '',
		y: '',
		rotation: 0,
		scale: 0
	},
	initialize: function() {
		// init event listeners
		this.on("change:content", this.refresh)
			.on("change:fontSize", this.refresh)
			.on("change:fontColor", this.refresh)
			.on("change:y", this.refresh)
			.on("change:x", this.refresh)
			.on("change:rotation", this.refresh);
		// create a placeholder div for this new object on the canvas
		var placeholder = $('<div class="cb_placeholder" />');
		placeholder
				.attr('data-model', 'TextObject')
				.attr('data-cid', this.cid)
				.css('top', this.get('y'))
				.css('left', this.get('x'))
				.css('width', this.get('width'))
				.css('height', this.get('fontSize'))
				.append( $('<div class="cb_ph_corner cb_ph_bottomLeft btn btn-mini" />') )
				.append( $('<div class="cb_ph_corner cb_ph_bottomRight btn btn-mini" />') )
				.append( '<div class="cb_ph_corner cb_ph_topLeft btn btn-mini"><i class="icon-resize-horizontal"></i></div>' )
				.append( '<div class="cb_ph_corner cb_ph_topRight btn btn-mini"><i class="icon icon-refresh"></i></div>' );
		$("#cb_canvasWrapper").append(placeholder);
	},
	refresh: function() {
		refreshCanvas();
		// update the placeholder div
		$("div[data-cid='"+this.cid+"']")
				.css('top', this.get('y') - this.get('fontSize'))
				.css('left', this.get('x'))
				.css('width', this.get('width'))
				.css('height', this.get('fontSize'));
	},
	write: function() {

		//console.log('objectXY: ' + this.get('x') + ', ' + this.get('y'));
		//console.log('object width,font: ' + this.get('width') + ', ' + this.get('fontSize'));

		context.save();

		// set options
		context.lineWidth = 1;
		context.fillStyle = this.get('fontColor');
		context.lineStyle = this.get('fontColor');
		context.font = this.get('fontSize') + 'px ' + this.get('fontFamily');

		// write to temp canvas and measure width
		this.set("width", context.measureText(this.get('content')).width, {silent:true});

		if ( this.get('rotation') !== 0 ) {
			context.translate(
				this.get('x') + (this.get('width') / 2),
				this.get('y') - (this.get('fontSize') / 2)
			);
			//console.log('Rotating around: ' + (this.get('x') + (this.get('width') / 2)) + ', ' + (this.get('y') - (this.get('fontSize') / 2)) );
			context.rotate(this.get('rotation') * Math.PI / 180);

			// rotate the overlay container
			$("div[data-cid='"+this.cid+"']").css('transform', 'rotate('+this.get('rotation')+'deg)');

			// draw out
			context.fillText(
				this.get('content'),
				0 - this.get('width') / 2,
				this.get('fontSize') / 2
			);
			//console.log('Writing, "'+this.get('content')+'", at: ' + (0 - this.get('width') / 2) + ', ' + (this.get('fontSize') / 2) );
		} else {
			context.fillText(this.get('content'), this.get('x'), this.get('y'));
			//console.log('Writing, "'+this.get('content')+'", at: ' + this.get('x') + ', ' + this.get('y'));
		}

		context.restore();		
	}
});