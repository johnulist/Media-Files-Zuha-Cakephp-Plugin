var TextEditView = Backbone.View.extend({
	
	initialize: function( attrs ) {
		this.options = attrs;
		this.render();
		$j('select[name="colorpicker"]').simplecolorpicker({picker: true});
	},
	
	render: function() {
		var template = _.template($("#template-textEdit").html(), this.options);
		this.$el.append(template);

		this.$('option[value="'+this.model.get('fontColor')+'"]').attr("selected", "selected");
		this.$('option[value="'+this.model.get('fontSize')+'"]').attr("selected", "selected");
		this.$('input#font').val(this.model.get('fontFamily'));

		if ( this.model.get('isEditable') === false ) {
			this.$('.cb_lock i').attr('class', 'icon-ban-circle');
		} else {
			this.$('.cb_lock i').attr('class', 'icon-ok-circle');
		}

		$("#cb_canvasWrapper").parent().unbind();

		return this;
	},
	
	events: {
		"keyup .textInput": "updateText",
		"click .cb_addEditText": "falseHandler",
		"click .cb_close": "close",
		"click .cb_up": "orderUp",
		"click .cb_down": "orderDown",
		"click .cb_lock": "toggleLock",
		"click .cb_remove": "remove",
		'click #font': 'toggleFonts',
		'click #fontList li': 'selectFont',
		'change select[name="colorpicker"]': 'updateColor',
		'change select[name="fontsizepicker"]': 'updateFontsize',
	},
	
	remove: function( event ) {
		AppModel.get('collection').remove( this.model );
		this.close();
	},
	
	toggleLock: function( event ) {
		this.model.set('isEditable', !this.model.get('isEditable'));
		if ( this.model.get('isEditable') === false ) {
			this.$('.cb_lock i').attr('class', 'icon-ban-circle');
		} else {
			this.$('.cb_lock i').attr('class', 'icon-ok-circle');
		}
	},
	
	orderUp: function( event ) {
		this.model.set('order', this.model.get('order') + 1);
	},
	
	orderDown: function( event ) {
		this.model.set('order', this.model.get('order') - 1);
	},
	
	toggleFonts: function( event ) {
		$("#fontList").fadeToggle();
	},
	
	selectFont: function( event ) {
		this.model.set('fontFamily', event.target.innerHTML);
		$("#font")
			.val(event.target.innerHTML)
			.css('font-family', event.target.innerHTML);
		$("#fontList").fadeOut();
		return false;
	},
	
	updateText: function( event ) {
		console.log(this.model);
		this.model.set('content', event.target.value);
	},
	
	updateColor: function( event ) {
		this.model.set('fontColor', event.target.value);
	},
	
	updateFontsize: function( event ) {
		this.model.set('fontSize', event.target.value);
	},
	
	falseHandler: function( event ) {
		return false;
	},
	
	close: function( event ) {
		if ( this.model.get('content') === '' ) {
			this.model.destroy();
		} else {
			var locked = !this.model.get('isEditable');
			if ( locked ) {
				if ( !window.confirm("Are you sure you want to lock this layer?  This cannot be undone.") ) {
					return;
				}
			}
		}
		$j('select[name="colorpicker"]').simplecolorpicker('destroy');
		this.$('.cb_addEditText').remove();
	}
});

var textEditHandler = function( event, text ) {
	if ( text === undefined ) {
		text = new TextObject({x: click.x, y: click.y});
		AppModel.get('collection').add(text);
	}
	console.log(text);
	var textEditor = new TextEditView({
		model: text,
		el: $("#cb_canvasWrapper").parent(),
		top: text.get('y') + $("#cb_canvasWrapper").offset().top + 10,
		left: text.get('x') + $("#cb_canvasWrapper").offset().left,
		content: text.get('content')
	});
};
