var ImageObject = Backbone.Model.extend({
	defaults: {
		type: 'ImageObject',
		content: '',
		x: 0,
		y: 0,
		width: '',
		height: '',
		rotation: 0,
		aspectRatio: 1,
		scale: [1,1],
		order: 0,
		image: new Image(),
		loaded: false
	},
	url: '/media/media/canvas',
	initialize: function() {
		this
			.on("change:x", this.refresh)
			.on("change:y", this.refresh)
			.on("change:order", this.refresh)
			.on("change:scale", this.refresh)
			.on("change:width", this.refresh)
			.on("change:height", this.refresh)
			.on("change:content", this.refreshContent)
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
				.append( '<div class="cb_ph_corner cb_ph_bottomLeft btn btn-mini" title="click to Flip Horizontally."><i class="icon icon-resize-horizontal"></i></div>' )
				.append( '<div class="cb_ph_corner cb_ph_bottomRight btn btn-mini" title="click to Flip Vertically."><i class="icon icon-resize-vertical"></i></div>' )
				.append( '<div class="cb_ph_corner cb_ph_topLeft btn btn-mini" title="click & drag to Resize; double-click to Auto-Resize."><i class="icon-fullscreen"></i></div>' )
				.append( '<div class="cb_ph_corner cb_ph_topRight btn btn-mini" title="click & drag to Rotate."><i class="icon icon-repeat"></i></div>' );
		$("#cb_canvasWrapper").append(placeholder);
		
		if ( this.get('content') !== '' ) {
			this.refreshContent;
		}
	},
	refresh: function() {
		console.log('refreshing an ImageObject');
		AppModel.get('collection').refreshCanvas();
		// update the placeholder div
		$("div[data-cid='"+this.cid+"']")
				.css('top', this.get('y'))
				.css('left', this.get('x'))
				.css('width', this.get('width'))
				.css('height', this.get('height'))
				.css('centerX', this.get('width') / 2)
				.css('centerY', this.get('height') / 2);
	},
	refreshContent: function() {
		var imageModel = this;
		console.log(imageModel);
		this.get('image').src = this.get('content');
		this.get('image').onload = function() {
			imageModel.set({
				height: this.height,
				width: this.width,
				aspectRatio: this.width / this.height,
				image: this,
				loaded: true
				}, {silent:true});
			console.log('loaded');
			imageModel.refresh();
		};
	},
	draw: function() {
		var imageObject = this;
		if ( imageObject.get('type') !== 'screenshot' ) {
			console.log('ImageObject::draw() fired.');
			// var img = new Image();
			// img.onload = function() {
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
					// no rotation - just draw it where it says it should be.
					dx = imageObject.get('x');
					dy = imageObject.get('y');
				}
				if (imageObject.get('scale')[0] == -1) {
					// flipped horizontally
					dx = -dx;
					width = -width;
				}
				if (imageObject.get('scale')[1] == -1) {
					// flipped vertically
					dy = -dy;
					height = -height;
				}
				context.scale(imageObject.get('scale')[0], imageObject.get('scale')[1]); // to flip vertically, ctx.scale(1,-1);
				
				context.drawImage(imageObject.get('image'), dx, dy, width, height);
				//debug
				console.log('drawing image at: ' + imageObject.get('x') + ', ' + imageObject.get('y'));
				context.restore();
				//return true;
			// };
			// img.src = this.get('content');
		}
	},
	resize: function() {
		console.log('resizing image');
		var imageObject = this;
		var xPrev;
		$("#cb_canvasWrapper").bind('mousemove', function(event) {
			console.log('resizing');   
	        if ( xPrev < event.pageX ) {
	        	// mouse moving right
	        	var newWidth = imageObject.get('width') + 1;
	        } else {
	        	// mouse moving left
	        	var newWidth = imageObject.get('width') - 1;
	        }
	        xPrev = event.pageX;

			if ( newWidth > 40 ) {
				imageObject
					.set('width', newWidth)
					.set('height', newWidth * (imageObject.get('aspectRatio')));
			}
		});
		return false;
	},
	autoResize: function() {
		console.log('auto resizing image');
		if ( this.get('aspectRatio') > (canvas.width / canvas.height) ) {
			this
				.set('width', canvas.width)
				.set('height', canvas.width / this.get('aspectRatio'));
		} else {
			this
				.set('width', canvas.width / this.get('aspectRatio'))
				.set('height', canvas.height);
		}
	}
});
