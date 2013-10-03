var TextEditView = Backbone.View.extend({
	initialize: function( attrs ) {
		this.options = attrs;
		this.render();
		$('select[name="colorpicker"]').simplecolorpicker({picker: true});
	},
	render: function() {
		var template = _.template($("#template-textEdit").html(), this.options);
		this.$el.append(template);

		this.$el.find('option[value="'+this.model.get('fontColor')+'"]').attr("selected", "selected");
		this.$el.find('option[value="'+this.model.get('fontSize')+'"]').attr("selected", "selected");
		this.$el.find('input#font').val(this.model.get('fontFamily'));

		$("#cb_canvasWrapper").parent().unbind();

		return this;
	},
	events: {
		"keyup .textInput": "updateText",
		"click .cb_addEditText": "falseHandler",
		"click .cb_close": "close",
		"click .cb_up": "orderUp",
		"click .cb_down": "orderDown",
		'click #font': 'toggleFonts',
		'click #fontList li': 'selectFont',
		'change select[name="colorpicker"]': 'updateColor',
		'change select[name="fontsizepicker"]': 'updateFontsize',
	},
	orderUp: function( event ) {
		this.model.set('order', this.model.get('order') + 1);
	},
	orderDown: function( event ) {
		this.model.set('order', this.model.get('order') - 1);
	},
	toggleFonts: function( event ) {
		console.log('toggling font list');
		$("#fontList").fadeToggle();
	},
	selectFont: function( event ) {
		this.model.set('fontFamily', event.target.innerHTML);
		$("#font")
			.val(event.target.innerHTML)
			.css('font-family', event.target.innerHTML);
		$("#fontList").fadeOut();
		console.log('fading out font list');
		return false;
	},
	updateText: function( event ) {
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
		$('select[name="colorpicker"]').simplecolorpicker('destroy');
		this.$el.find('.cb_addEditText').remove();
	}
});

var textEditHandler = function( event, text ) {
	if ( text === undefined ) {
		text = new TextObject({x: click.x, y: click.y});
		CanvasObjectCollection.get('collection').add(text);
		//debug
		console.log('text added to CanvasObjectCollection at: ' + click.x + ', ' + click.y);
	} else {
		console.log('editing text object: ' + text.cid);
	}
	var textEditor = new TextEditView({
		model: text,
		el: $("#cb_canvasWrapper").parent(),
		top: text.get('y') + $("#cb_canvasWrapper").offset().top + 10,
		left: text.get('x') + $("#cb_canvasWrapper").offset().left,
		content: text.get('content')
	});
};
