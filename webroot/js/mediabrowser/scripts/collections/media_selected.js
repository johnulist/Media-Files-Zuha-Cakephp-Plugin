define([
  'underscore',
  'backbone',
  'models/media'
], function(_, Backbone, MediaItem){
  var MediaCollection = Backbone.Collection.extend({
	  model: MediaItem,
  });
  
  return MediaCollection;
});