$('document').ready(function(){

	//Definitions
	var Person = Backbone.Model.extend({
		defaults: {
			first_name: 'John',
			last_name: 'Smith',
			name: '',
			occupation: 'Web Guy',
			phone_number: '678-617-5386'
		},
		fullName: function(){
			return this.get('first_name') + ' ' + this.get('last_name');
		}
	}); //Ends person model

	//Collection of People
	var PeopleCollection = Backbone.Collection.extend({
		model: Person
	});

	var PersonView = Backbone.View.extend({
		tagName: 'li',
		template: _.template( $('#personTemplate').html() ),

		initialize: function(){
			//console.log('Im the constructor');
			this.render();
		},
		render: function(){
			//console.log('I take the template and put the data into it.');
			this.$el.html(this.template(this.model.toJSON()));
			$($('#content')).append(this.el);
		}	
	}); //Ends View Definition

	//Implementation: Instances - Model / View
	//var person = new Person();
	//var personView = new PersonView({ model: person });

	//New collection
	var people = new PeopleCollection(roledex);
});
