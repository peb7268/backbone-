/** Project Name: Overview
*	Desc: A Basecamp Replacement
*
*
*
* -- Notes --
* #Always return this from your render method. This allows chaining.
*
*/

//Namespace
(function(){
	window.Overview = {
		Models: {},
		Collections: {},
		Views: {}
	};
	//Globals
	window.template = function(id){
		return _.template($('#' + id).html());
	};

	//Definitions
	Overview.Models.Person = Backbone.Model.extend({
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
	}); 
	//Collection of People
	Overview.Collections.People = Backbone.Collection.extend({
		model: Overview.Models.Person
	});

	Overview.Views.Person = Backbone.View.extend({
		tagName: 'li',
		template: template('personTemplate'),

		render: function(){
			//console.log('I take the template and put the data into it.');
			this.$el.html(this.template(this.model.toJSON()));
			return this;	//If you omit this it will not chain and continue after it creates each person view
		}	
	}); 
	//View for all People (Collection View)
	Overview.Views.People = Backbone.View.extend({
		tagName: 'ul',

		render: function(){
			//Filter through all items in a collection
			this.collection.each(function(personModel){
			
			//Foreach create a new person view 	
			var person = new Overview.Views.Person({ model: personModel });

			//Append to the root element
			this.$el.append(person.render().el);
		}, this);

			//Add the final result to the body
			//$($('#content')).append(this.el);
			return this;
		}
	});


	//Implementation: Instances - Collection / CollecitonView
	var people = new Overview.Collections.People(roledex),
		PeopleView = new Overview.Views.People({ collection: people });
	
	//Add the collection to the body	
	$(document.body).append(PeopleView.render().el);

})();