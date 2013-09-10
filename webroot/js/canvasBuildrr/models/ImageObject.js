var ImageObject = Backbone.Model.extend({
	defaults: {
		type: 'image',
		content: '',
		x: '',
		y: '',
		width: '',
		height: '',
		rotation: 0,
		aspectRatio: 1,
		scale: [1,1]
	},
	initialize: function() {
		this
			.on("change:x", this.refresh)
			.on("change:y", this.refresh)
			.on("change:scale", this.refresh)
			.on("change:width", this.refresh)
			.on("change:height", this.refresh)
			.on("change:content", this.refresh)
			.on("change:rotation", this.refresh);
		// create a placeholder div for this new object on the canvas
		var placeholder = $('<div class="cb_placeholder" />');
		placeholder
				.attr('data-model', 'ImageObject')
				.attr('data-cid', this.cid)
				.css('top', this.get('y'))
				.css('left', this.get('x'))
				.css('width', this.get('width'))
				.css('height', this.get('height'))
				.append( '<div class="cb_ph_corner cb_ph_bottomLeft btn btn-mini"><i class="icon icon-resize-horizontal"></i></div>' )
				.append( '<div class="cb_ph_corner cb_ph_bottomRight btn btn-mini"><i class="icon icon-resize-vertical"></i></div>' )
				.append( '<div class="cb_ph_corner cb_ph_topLeft btn btn-mini"><i class="icon-fullscreen"></i></div>' )
				.append( '<div class="cb_ph_corner cb_ph_topRight btn btn-mini"><i class="icon icon-repeat"></i></div>' );
		$("#cb_canvasWrapper").append(placeholder);
	},
	refresh: function() {
		refreshCanvas();
		// update the placeholder div
		$("div[data-cid='"+this.cid+"']")
				.css('top', this.get('y'))
				.css('left', this.get('x'))
				.css('width', this.get('width'))
				.css('height', this.get('height'))
				.css('centerX', this.get('width') / 2)
				.css('centerY', this.get('height') / 2);
	},
	draw: function() {
		var img = new Image();
		var imageObject = this;
		img.onload = function() {
			var width = ( imageObject.get('width') === '' ) ? null : imageObject.get('width');
			var height = ( imageObject.get('height') === '' ) ? null : imageObject.get('height');
			
			var dx;
			var dy;
			
			context.save();
			if ( imageObject.get('rotation') !== 0 ) {
				// rotate the canvas
				context.translate(
					imageObject.get('x') + (width / 2),
					imageObject.get('y') + (height / 2)
				);
				context.rotate(imageObject.get('rotation') * Math.PI / 180);
				
				// rotate the overlay container
				$("div[data-cid='"+imageObject.cid+"']").css('transform', 'rotate('+imageObject.get('rotation')+'deg)');
				
				dx = -(width / 2);
				dy = -(height / 2);
			} else {
				dx = imageObject.get('x');
				dy = imageObject.get('y');
			}
			if (imageObject.get('scale')[0] == -1) {
				dx = -dx;
				width = -width;
			}
			if (imageObject.get('scale')[1] == -1) {
				dy = -dy;
				height = -height;
			}
			context.scale(imageObject.get('scale')[0], imageObject.get('scale')[1]); // to flip vertically, ctx.scale(1,-1);
			
			context.drawImage(img, dx, dy, width, height);
			context.restore();
		};
		img.src = this.get('content');
		//debug
		console.log('drawing image at: ' + this.get('x') + ', ' + this.get('y'));
	}
});